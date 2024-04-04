import { Select, Spin } from 'antd';
import type { DefaultOptionType, SelectProps } from 'antd/lib/select';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';

type DataType = {
  data: DefaultOptionType[] | undefined | null;
  hasNext: boolean;
};

type Props = {
  value?: DefaultOptionType | DefaultOptionType[] | undefined | null;
  fetchData?: (page: number) => Promise<DataType>;
  searchData?: (value: string, page: number) => Promise<DataType>;
};
const InfiniteScrollSelect: React.FC<Props & SelectProps> = ({
  value: _value,
  fetchData,
  searchData,
  ...antProps
}) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<DefaultOptionType[]>([]); // [
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);

  const [pageOptions, setPageOptions] = useState<DefaultOptionType[]>([]); // [
  const [isComposing, setIsComposing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchPage, setSearchPage] = useState(1);
  const [searchHasNext, setSearchHasNext] = useState(true);

  const searchMoreData = (value: string | undefined | null, curPage: number = 1) => {
    if (loading) return;
    if (!(value && searchData)) return;
    setLoading(true);
    searchData(value, curPage)
      .then((data) => {
        const dataList = data.data || [];
        if (curPage === 1) setOptions(dataList);
        else {
          setOptions((prev) => {
            return [...prev, ...dataList];
          });
        }
        setSearchHasNext(data.hasNext);
        setSearchPage(searchPage + 1);
      })
      .finally(() => setLoading(false));
  };

  const fetchMoreData = (curPage: number = 1) => {
    // 避免搜索的时候获取普通查询的下一页
    if (isComposing || searchText) return;
    if (loading) return;
    if (!fetchData) return;
    setLoading(true);
    fetchData(curPage)
      .then((data) => {
        const dataList = data.data || [];
        if (curPage === 1) {
          setOptions(dataList);
          setPageOptions(dataList);
        } else {
          setOptions((prev) => {
            const newData = [...prev, ...dataList];
            setPageOptions(newData);
            return newData;
          });
        }
        setHasNext(data.hasNext);
        setPage(page + 1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMoreData(1);
  }, []);

  useEffect(() => {
    if (!_value) {
      setSearchText('');
      setOptions(pageOptions);
    }
  }, [_value]);

  const handleSearch = debounce((value: string) => {
    if (!value) {
      setOptions(pageOptions);
      return;
    }
    if (!searchData) return;
    setSearchPage(1);
    setSearchHasNext(true);
    setSearchText(value);
    searchMoreData(value, 1);
  }, 700);

  const handleScroll = (e: any) => {
    if (!searchText && !hasNext) return;
    else if (searchText && !searchHasNext) return;
    const { target } = e;
    const tolerance = 10; // 容差
    if (target.scrollTop + target.clientHeight + tolerance >= target.scrollHeight) {
      if (searchText) searchMoreData(searchText, searchPage);
      else fetchMoreData(page);
    }
  };

  return (
    <Select
      placeholder="请输入名称搜索"
      size="small"
      allowClear
      showArrow={true}
      optionFilterProp="label"
      maxTagTextLength={8}
      {...antProps}
      value={_value}
      showSearch
      notFoundContent={loading ? <Spin size="small" /> : null}
      options={options}
      onPopupScroll={handleScroll}
      onSearch={(value) => {
        if (isComposing) return;
        handleSearch(value);
      }}
      onClear={() => {
        setSearchText('');
        setOptions(pageOptions);
      }}
      // @ts-ignore
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={(e: any) => {
        setIsComposing(false);
        handleSearch(e.target.value);
      }}
    />
  );
};

export default InfiniteScrollSelect;
