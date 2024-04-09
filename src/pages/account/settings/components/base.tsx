import {AutomaticAvatar} from '@/components/automatic-avatar';
import {useModel} from '@umijs/max';
import {Button, Cascader, Form, Input, message, Select, Skeleton} from 'antd';
import React, {useState} from 'react';
import options from '../geographic/cascaderAddressOptions';
import styles from './BaseView.less';
import {updateCurrentUser} from "@/services/craicCoffee/settingController";
import {currentUser as queryCurrentUser} from "@/services/craicCoffee/authController";
import {Upload} from 'antd';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';

const Occupations = {
    BARISTA: '咖啡师',
    ROASTER: '烘豆师',
    CUPPING_MASTER: '咖啡品鉴师',
    COFFEE_FARMER: '咖农',
    SUPPLIER: '供应商',
    BREWER: '冲煮师'
};
const BaseView: React.FC = () => {
    const {initialState, setInitialState} = useModel('@@initialState');
    const [currentUser, setCurrentUser] = useState(initialState?.currentUser);
    const [location, setLocation] = useState({
        province: '',
        city: '',
    });
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar);
    const [avatarFile, setAvatarFile] = useState(null);

    const onCascaderChange = (value, selectedOptions) => {
        const values = {
            province: '',
            city: '',
        };

        // 确保selectedOptions不是undefined再检查其length属性
        if (selectedOptions && selectedOptions.length > 0) {
            values.province = selectedOptions[0] ? selectedOptions[0].label : '';
            if (selectedOptions.length > 1) {
                values.city = selectedOptions[1] ? selectedOptions[1].label : '';
            }
        }

        // 更新state
        setLocation(values);
    };

    // If there's no initial state or no current user in the initial state, show a loader
    if (!currentUser) return <Skeleton/>;

    const handleFinish = async (values) => {
        try {
            // Combine the original values object with locationData
            const updatedValues = {...values, ...location};

            // Check if there's an avatar file to upload and include it in the updated values
            if (avatarFile) {
                updatedValues.avatar = avatarFile;
            }

            // Filter out undefined values
            const payload = Object.entries(updatedValues).reduce((acc, [key, value]) => {
                if (value !== undefined) {
                    acc[key] = value;
                }
                return acc;
            }, {});

            // Call the updateCurrentUser API, passing the form data including the avatar if present
            await updateCurrentUser(payload);

            // If successful, display a success message
            message.success('更新基本信息成功');

            // Re-fetch the current user data
            const updatedUser = await queryCurrentUser(); // Assuming this is the function to fetch current user data

            // Update the local state with the new user information
            setCurrentUser(updatedUser.data);

            // Optionally, if you want to update the initial state as well:
            // setInitialState({ ...initialState, currentUser: updatedUser });
        } catch (error) {
            // If an error occurs, display an error message
            message.error(`更新失败: ${error.message}`);
        }
    };

    const parseOccupations = (occupations) => {
        try {
            return JSON.parse(occupations);
        } catch (error) {
            console.error('解析职业数据出错:', error);
            return [];
        }
    };

    const beforeUpload = (file) => {
        // 检查文件类型...
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('你只能上传 JPG/PNG 文件!');
        }
        // 检查文件大小...
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图像必须小于 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    const handleChange = info => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // 获取图片本地预览URL
            const imageUrl = URL.createObjectURL(info.file.originFileObj);
            setAvatarUrl(imageUrl);
            // 保存文件对象到状态中，以便稍后上传
            setAvatarFile(info.file.originFileObj);
            setLoading(false);
        }
    };

    return (
        <div className={styles.baseView}>
            <div className={styles.left}>
                <Form
                    layout="horizontal"
                    onFinish={handleFinish}
                    initialValues={{
                        email: currentUser.email,
                        phone: currentUser.phone,
                        nickname: currentUser.nickname,
                        bio: currentUser.bio ? currentUser.bio : '',
                        province: [currentUser.province, currentUser.city],
                        country: currentUser.country,
                        address: currentUser.address,
                        occupations: parseOccupations(currentUser.occupations),
                        // avatar: currentUser.avatar,
                    }}
                >
                    {/* 邮箱 */}
                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[{required: true, message: '请输入您的邮箱!'}]}
                    >
                        <Input placeholder="请输入"/>
                    </Form.Item>

                    {/* 昵称 */}
                    <Form.Item
                        name="nickname"
                        label="昵称"
                        rules={[{required: true, message: '请输入您的昵称!'}]}
                    >
                        <Input placeholder="请输入"/>
                    </Form.Item>

                    {/* 个人简介 */}
                    <Form.Item
                        name="bio"
                        label="个人简介"
                    >
                        <Input.TextArea placeholder="个人简介"/>
                    </Form.Item>

                    {/* 国家/地区 */}
                    <Form.Item
                        name="country"
                        label="国家/地区"
                    >
                        <Select options={[{label: '中国', value: 'China'}]} allowClear/>
                    </Form.Item>

                    {/* 所在省市 */}
                    <Form.Item
                        name="province"
                        label="所在省市"
                    >
                        <Cascader
                            options={options}
                            onChange={onCascaderChange}
                            showSearch
                            placeholder="请选择地址"
                        />
                    </Form.Item>

                    {/* 街道地址 */}
                    <Form.Item
                        name="address"
                        label="街道地址"
                    >
                        <Input.TextArea placeholder="街道地址"/>
                    </Form.Item>

                    {/* 联系电话 */}
                    <Form.Item
                        name="phone"
                        label="联系电话"
                        rules={[{required: true, message: '请输入联系电话！'}]}
                    >
                        <Input placeholder="联系电话"/>
                    </Form.Item>

                    {/* 职业 */}
                    <Form.Item
                        name="occupations"
                        label="职业"
                    >
                        <Select
                            mode="multiple"
                            placeholder="请选择职业"
                            // 使用 map 函数直接从 Occupations 枚举中生成选项
                            options={Object.entries(Occupations).map(([value, label]) => ({label, value}))}
                        />
                    </Form.Item>

                    <Form.Item name="avatar" label="头像">
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                        >
                            <div>
                                {loading ? <LoadingOutlined/> : <PlusOutlined/>}
                                <div style={{marginTop: 8}}>上传</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    {/* 技能 - 这里需要根据你的具体需求设计表单项 */}
                    {/* 例如，你可以使用动态表单项来允许用户添加多个技能 */}

                    {/* 更新按钮 */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            更新基本信息
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className={styles.right}>
                {/* 头像显示，假设你有一个用于显示头像的组件 */}
                <AutomaticAvatar user={currentUser} size={64}/>
                {/* 用户邮箱信息 */}
                <div>{currentUser.nickname || currentUser.email}</div>
            </div>
        </div>
    );
};

export default BaseView;
