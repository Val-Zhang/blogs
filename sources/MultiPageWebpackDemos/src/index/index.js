import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

const Index = () => {
    return (
        <div className="index">
            <div className="indexIco">
            </div>
            rabbit,默认打开index页
            <p>点击下面的链接可跳转</p>
            <a href="http://localhost:8080/cat">小猫页(cat)</a>
            <br/>
            <a href="http://localhost:8080/dog">小狗页(dog)</a>
        </div>
    )
};


ReactDOM.render(<Index/>, document.querySelector("#root"));