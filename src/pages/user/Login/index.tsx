import Footer from '@/components/Footer';
import LoginFormV1 from '@/components/LoginForm';
import {Col, Row} from 'antd';
import React from 'react';
import {ThemeSwitcherProvider} from 'react-css-theme-switcher';
import styles from './index.less';

const backgroundURL = '/img/others/img-17.jpg';
const backgroundStyle = {
  backgroundImage: `url(${backgroundURL})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
};

const themeMap = {
  dark: `/css/dark-theme.css`,
  light: `/css/light-theme.css`,
};

const Login: React.FC = () => {
  return (
    <ThemeSwitcherProvider themeMap={themeMap} insertionPoint="styles-insertion-point">
      <div className={styles.container}>
        <Row justify="center" className={`align-items-stretch ${styles.h100vh}`}>
          <Col xs={20} sm={20} md={24} lg={16}>
            <Row justify="center" className={styles.h100vh}>
              <div className="mt-4">
                {/*<div className={styles.lang} data-lang>*/}
                {/*  {SelectLang && <SelectLang/>}*/}
                {/*</div>*/}
                <p>Don't have an account yet? <a href="/user/register">Sign Up</a></p>

                <div style={{marginTop: '30%'}}>
                  <LoginFormV1/>
                </div>
                <Footer/>
              </div>
            </Row>
          </Col>
          <Col xs={0} sm={0} md={0} lg={8}>
            <div
              className="d-flex flex-column justify-content-between h-100 px-4"
              style={backgroundStyle}
            >
              <Row justify="center" align="middle" style={{height: '100%'}}>
                <Col xs={0} sm={0} md={0} lg={20}>
                  <img className="img-fluid mb-5" src="/img/others/img-18.png" alt=""/>
                  <h1 className="text-white">欢迎来到Craic Coffee</h1>
                  <p className="text-white">
                    Craic Coffee 的由来是因为主理人Gary和Carina在爱尔兰生活了8年，对爱尔兰有很深的情感。“What's the
                    craic”是爱尔兰人们用来打招呼的方式，craic是爱尔兰的俚语，表示“有趣、愉快的氛围、友好愉快的交谈”，我们就觉得这个词很适合，我们希望带给大家愉快的体验，以及通过咖啡将大家连结在一起，也是有种以咖会友的感觉。
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </ThemeSwitcherProvider>
  );
};

export default Login;
