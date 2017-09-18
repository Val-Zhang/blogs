import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

const Login = () => {
    return (
        <div className="login">
            <div className="loginIco">

            </div>
            cat
            <p>点击下面的链接可跳转</p>
            <a href="http://localhost:8080">小兔页（index）</a>
            <br/>
            <a href="http://localhost:8080/dog">小狗页(dog)</a>
        </div>
    )
};

ReactDOM.render(<Login/>, document.querySelector("#root"));