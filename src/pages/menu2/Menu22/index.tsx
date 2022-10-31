import { Button, Input } from "antd";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { menuState } from "../../../recoil/atoms/menu";

const updateMenu = (list: any[], key: string, label: string) => {
    for (let i = 0; i < list.length; i++) {
        if (list[i].key === key) {
            list[i].label = label;
            break;
        }
        if (Array.isArray(list[i]?.children)) {
            updateMenu(list[i].children, key, label)
        }
    }
    return list;
}
export const Menu22 = (props: any) => {
    const { state } = props;
    const [menu, setMenu] = useRecoilState(menuState)
    const [value, setValue] = useState(state?.label);
    const save = () => {
        const oldMenu = JSON.parse(JSON.stringify(menu));
        const newMenu = updateMenu(oldMenu, state?.key, value);
        setMenu([...newMenu]);
    }
    return (
        <>
            <Input.Group compact>
                <Input style={{ width: '200px' }} value={value} onChange={(e: any) => {
                    setValue(e.target.value)
                }} />
                <Button type="primary" onClick={() => save()}>保存</Button>
            </Input.Group>
        </>
    );
}