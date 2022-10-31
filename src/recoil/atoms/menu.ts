import { atom } from "recoil";

export const menuState = atom({
    key: 'menuState',
    default: [
        {
            key: '1',
            label: '菜单一',
            path: 'menu1',
            children: [
                {
                    key: '1-1',
                    label: '子菜单1-1',
                    path: 'menu1/1-1'
                },
                {
                    key: '1-2',
                    label: '子菜单1-2',
                    path: 'menu1/1-2'
                }
            ]
        },
        {
            key: '2',
            label: '菜单二',
            path: 'menu2',
            children: [
                {
                    key: '2-1',
                    label: '子菜单2-1',
                    path: 'menu2/2-1'
                },
                {
                    key: '2-2',
                    label: '子菜单2-2',
                    path: 'menu2/2-2'
                }
            ]
        },
    ]
})