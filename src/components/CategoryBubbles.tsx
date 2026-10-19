import React from 'react';
import { useStore } from '../context/StoreContext';

interface CategoryBubbleProps {
  onSelectCategory?: (category: string) => void;
}

export const CategoryBubbles: React.FC<CategoryBubbleProps> = ({ onSelectCategory }) => {
  const { categories } = useStore();

  const defaultCategoryImages: { [key: string]: string } = {
    'Three Piece': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgl1mxD7xqCL0ynMNHnEYB4ly1czqvWwe1H5N3DUQh5cBDXWKPuDe4wdlPKjvknMiA_1e6M_VYLDaJ_rBBK9qywF2nVMtoDXxfFI-0xvBbtu7nzGUsrtjs7ZhldAGoo4UyhtHx5HoNoFu7ISoVKtXUeUXaGW2GSQW9h8XD7Z5oai92fBhLU8bzfeNS7TnUheeFZimFZPUgyAUFZhWDmHs9Ed1ClecfnBfKFB0GbHwgudWl2NNuyulyiw',
    'Saree': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxUMFZmvcY_p5Ci-PIml_Bfhs3pRc9IEdin8J5lDPT7-OosOKk0HeJI4CzXmwIQHL-q_NtT4T4KHmZTYOJdhbW1u5euUsUMwGBdczNR3pHdd-1NvQUAxkEPmLopiFOhYknTRq8z1nlbZRrBdzAU-WS1u1tbsxwb8SeWHSRwx5g8sFAZw1dZMc6B9v77wk-MhrXCzelsLOj5zuz65w1c5DDPHV7mrCv9nff77p6CzXn1UTxn970tNMXyw',
    'Kurti': 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7wruyNf5oPKZNBsyD2im6mOOe3YFEJA5VZz_Bb1LJdE4An0FDCTk4GDh4WOV9zycwxu_Z6IiRgaUBSGrWaHfUmCY_clJ7_bUHvFbkypUuaJN7LVO1aY_-a8ixMKScjfiPtRCKZPtKPqBXYAXNaIThYVGPQlU2bjjtayt7-QH3GBS41xzi3zt9y8Y9Hwx8rP6WkmJ8bnAf7q8dgflnq4mtgKRmQbY2J7wkTE2o6AE2QVh3YOtfXYzskg',
    "Men's Wear": 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHVvNf2_CmOAj53nasaS4aXy96Tj7G_n_nBIK6tazh4z2cjpd7N4GbLUuy4v37PVzNT1tFJNlSXLqXNpADYk5hYRgqp7u2q4QuyBre1haWQD10Z00GqR_8NstHjKhnSZrOz867pDzTIT8Ihddfhmsf8ixVfnVbiU0Bc9knV5NcGVRgFeqrawPyyDYH9OaueZjnr7Dw7ttVW6eJN077C0xrXmcRDLFl6QFSFjwHHDA0xB37uqyraXQi_w',
    'Kids Wear': 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7knPnNbDULYX-WWrx9NVEQlA1rqtxOB1fW5Bvm-Fzdn7RWxzeWJKkXpYM8LpwIagupsoq0SInJeOl-ejzWT9XZMfyDhxtKQ4-GZ_WIK6Upzz4glgBHqSpL-RyUBzgsUkRSqaE6Pzl16dy7IvlZDcYGDpEvX2fO4PU8CBLjHm8D16C8G9t5NWF3D_TqLz7f2jI6_C75yg1tesY_zGOh2I9Vt-IAwqyW--zVfPT9G5hfqlRuU6NkuQz-w',
    'T-Shirt': 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_Dx4KnfNwolc1jFkTg3KqOLaPFHQSsURrNMhIEtGude4L1A-U3Gm7kByzVGuT_Loggup3dWoUPwZ11atJtY-Sa3cMeEydi9PZIJOp1PFCMiDgCylRUKp7nPATs-coNroooxBce0W9ZZBgUy1cCB7ssJAmovL7ErXIvLjkFmuTRLrhIIjI_UDc1wiJGLegWUzkjN2ATiKSuCZ0PUlB5S75J49GvzieCNtH5vzbFZsYOgSIYFHrH3JYXQ',
    'Pants': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrZyRuQW56gx6SObu82JSclOKgv84Tj6YL6-3pLqTn4dgXu41KV2ZPYBU6xSZ2M9CJiuJwzZLcHvLVgnK3PdwdH5BzOZymPR-yHFya2XImx6kWDxx_-eIW5Z51ikMEfLC5aCwouJnf_2-2nuau01DoFISkXatjfajRzK36cwuYhdIic5VjS_RGCa6_oYcWI8DazyrsOf2bbqgpNv4OcUH7fWraFj6mQewQ_xv-PqHyJx2TRAwCP93NJg',
    'Hijab': 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6wwDrE_y3BP5tQPvMnmCXp43LZjoF8m6KTK-WoFcUo1T5t1ShubVL0yn9-rTc_7q3JR9GiUN1t66mhAlWwxDpHideZQD7M441BEfGYhqPNPQgClZgE6rLW53ZYkVPkm2_GR7GbjVkFgzfRBvHF_b1itTjsqzp_FD2B8vwPnAv2I91PDYWo5pbpqW3hVPbw2npNPiUxxEx-1wdMhTuyjlUappNLmyb3ze7JEsA5SNhdGU6LnTgTabZgw',
    'Shoes': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMVQCvL6vhVKdBAiHnhj5Hlan-Tv9p7RBQI_dvBTcUFFs_UP8As4TsfneqVyS-zKRCZ5fAtNJPhjGcc0NKBfn_WeEipTVRbVlBjK-Mcu19hgcdxS-oMzwB1m-8JiU4puJ9wMUXMbPXv77wb_Cm3avWR3JMRM5joOQWXOxIEWY-EtE2ULMFZmOV01msZrkYfb4LWvoqiAvPsygCmhxghq5lLtgCdbc99Wh5DN0U8zNDR3i3hDeS_4pUZw',
    'Bags': 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-pkZ34lfLrZ0-UGT2wjkU-JC6SecQYpRMX-lzKfK8CeXOE6SiEHfkuZyVeKrfR1KR_HQ22Ax8N_IT1cBzQ4l0AuspcJv2BnnxIotBKGmAwG-lcE0C480Czjo3XMnW3PQPzKEdNWgLcHXajyd8rr88E5jEh3qgl1f7QssjnXUQLJdjeqJ9nbIB9jCCXg5_7ZV5AkDV8XS1gXurmsy9aT9chPClelhbZG94rBUT1C61SKkr8fU33zaHeg',
    'Beauty': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRtrBSWpU4kv2GcXpmaYlB9yfJoJo4YRHwtrj6fFtoWLU8TDqyLsUXn9mz2RZhy0aslz9CbytJsbJQwv9pxSH_ppKh2GDVb0FjNKeqdXR-vYYiElc_HgEiE2X9viTMnxu8Scdb7nqiRP2kv2ZpsM94SS29BO2Pl1CAN1Lzwq9nYrkCKCXVlXy7RAayd2SDJcaQde6iJoxKpmvofJt06wTSUDhKgChz0gtMQTTJgvxbHd-QeCOZT9kdOg',
    'Beauty & Makeup': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRtrBSWpU4kv2GcXpmaYlB9yfJoJo4YRHwtrj6fFtoWLU8TDqyLsUXn9mz2RZhy0aslz9CbytJsbJQwv9pxSH_ppKh2GDVb0FjNKeqdXR-vYYiElc_HgEiE2X9viTMnxu8Scdb7nqiRP2kv2ZpsM94SS29BO2Pl1CAN1Lzwq9nYrkCKCXVlXy7RAayd2SDJcaQde6iJoxKpmvofJt06wTSUDhKgChz0gtMQTTJgvxbHd-QeCOZT9kdOg',
    'Electronics': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQwWovyKvkKiWd6JFv7pVBoAcupl5aBrsQobcwc24vjrZCojC_aDRF10ziLIDaqwENXkMQUYWoobFVS-vnVsqCNhCrxsSPWnddkMlF8xhxLDUNO8tnocbJrnc9jNAE2Sin-mNgBRZl6I2IQ9w8gU_dHmvvrcC9D9Skf_e0EbcMp1vpSPhNefuoDtwPSjxu5vD72QBBbfD8e4qYKCj5bm5Ik-wk8uQQKhIVg158EzBWb334_Cfa8fqYWQ'
  };

  const items = categories.map(cat => ({
    name: cat.name,
    nameBn: cat.nameBn,
    image: cat.image || defaultCategoryImages[cat.name] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80'
  }));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-3 text-center">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectCategory && onSelectCategory(item.name)}
            className="group flex flex-col items-center cursor-pointer text-left focus:outline-none"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-amber-500 shadow-sm bg-gray-100 transition-all p-0.5">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-[11px] font-medium text-gray-700 mt-1.5 group-hover:text-amber-600 transition-colors text-center w-full truncate">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
