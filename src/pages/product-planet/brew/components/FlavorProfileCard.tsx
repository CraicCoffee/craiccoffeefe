import React, { useState, useEffect } from 'react';
import {createFlavorProfile, getFlavorProfile} from "@/services/craicCoffee/productPlanetController";
import FlavorProfileForm from "@/pages/product-planet/brew/components/FlavorProfileForm";
import FlavorProfileView from "@/pages/product-planet/brew/components/FlavorProfileView";
// 假设这是你的 API 调用方法

const FlavorProfileCard = ({ brewId }) => {
  const [flavorProfile, setFlavorProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 获取风味描述
    const fetchData = async () => {
      setLoading(true);
      try {
        const profile = await getFlavorProfile(brewId);
        setFlavorProfile(profile);
        setLoading(false);
      } catch (error) {
        // 在此处理错误，例如设置错误消息状态
        setLoading(false);
        // 如果没有风味描述，设置编辑模式为true
        setEditing(true);
      }
    };

    fetchData();
  }, [brewId]);

  const handleEdit = () => {
    // 开启编辑模式
    setEditing(true);
  };

  const cancelEdit = () => {
    // 取消编辑模式
    setEditing(false);
    // 如果没有现有的风味描述，可能需要重置状态
    if (!flavorProfile) {
      setFlavorProfile(null);
    }
  };

  const handleSubmit = async (newFlavorProfile) => {
    setLoading(true);
    try {
      const flavorProfileData = {
        brewId: brewId,
        ...newFlavorProfile // 使用扩展运算符展开 newFlavorProfile 的属性
      };

      const updatedProfile = await createFlavorProfile(flavorProfileData);
      console.log(updatedProfile);
      setFlavorProfile(updatedProfile);
      setEditing(false);
      setLoading(false);
    } catch (error) {
      // 在此处理错误
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (editing) {
    return (
      // 渲染编辑表单
      <FlavorProfileForm
        flavorProfile={flavorProfile}
        onCancel={cancelEdit}
        onSubmit={handleSubmit}
      />
    );
  }

  if (flavorProfile) {
    return (
      // 渲染风味描述视图
      <FlavorProfileView
        flavorProfile={flavorProfile}
        onEdit={handleEdit}
      />
    );
  }

  return <div>No flavor profile found. Click here to create one.</div>;
};

export default FlavorProfileCard;
