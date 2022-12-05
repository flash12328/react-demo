import { Fragment, useState } from "react";

export const Menu11 = (props: any) => {
    // let item;
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [list, setList] = useState([1, 2, 3]);
    return (
        <>
            <div r-if={show}>r-if 一级
                <ul>
                    {
                        Array.isArray(list) && list.length > 0 && list.map((item, index) => {
                            return <Fragment r-if={item === 2}>
                                <li>{item}</li>
                            </Fragment>
                        })
                    }
                </ul>
                <h1 r-if={show1}>r-if 二级</h1>
            </div>
            <div r-show={show}>r-show</div>
            {/* <ul>
                <li r-for="item in list">{item}</li>
            </ul> */}

            <button onClick={() => setShow(!show)}>切换一级显示</button>
            <button onClick={() => setShow1(!show1)}>切换二级显示</button>
        </>
    );
}