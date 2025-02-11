// import React from 'react';

// function LoginPage() {
//   const handleGoogleLogin = () => {
//     // redirect to Spring's endpoint
//     window.location.href = 'http://localhost:8081/oauth2/authorization/google';
//   };

//   return (
//     <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginTop:'100px' }}>
//       <h2>Welcome to My Security App</h2>
//       <p>Please log in to continue.</p>
//       <button onClick={handleGoogleLogin} style={{ padding:'8px 16px', cursor:'pointer' }}>
//         Log In with Google
//       </button>
//     </div>
//   );
// }

// export default LoginPage;

import { Row, Col, Card, Typography, Button } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import ArmorCodeLoginImage from '../assets/ArmorCode-banner.png';

const { Title, Text } = Typography;

function LoginPage() {
  const handleGoogleLogin = () => {
    // redirect to Spring's endpoint
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';
  };

  return (
    <div style={{ height: '100vh', backgroundColor: '#f5f7fa' }}>
      <Row style={{ height: '100%' }}>
        {/* Left Side: Login Section */}
        <Col
          xs={24}
          md={10}
          lg={8}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#fff',
          }}
        >
          <Card
            style={{
              width: '80%',
              maxWidth: 400,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: 8,
            }}
          >
            <Title level={3} style={{ textAlign: 'center', marginBottom: 8 }}>
              Login
            </Title>
            <Text
              type="secondary"
              style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}
            >
              Welcome! Please sign in to continue
            </Text>

            <Button
              type="primary"
              icon={<GoogleOutlined />}
              style={{ width: '100%', marginBottom: 16 }}
              onClick={handleGoogleLogin}
            >
              Sign in using Google
            </Button>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Text type="secondary">
                © 2024 ArmorCode Inc, All rights reserved
              </Text>
            </div>
          </Card>
        </Col>

        {/* Right Side: Banner Section with Background Image */}
        <Col
          xs={0}
          md={14}
          lg={16}
          style={{
            height: "100%",
            width: "100%",
            position: 'relative',
            backgroundImage: `url(${ArmorCodeLoginImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* <div
            style={{
              width: '70%',
              maxWidth: 600,
              height: 300,
              // background: 'linear-gradient(135deg, #5f37ef 0%, #7a5cea 100%)',
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              padding: '2rem',
            }}
          >
            <Title level={2} style={{ color: '#fff', margin: 0 }}>
              ArmorCode
            </Title>
            <Text style={{ color: '#fff', fontSize: 16, marginTop: 8 }}>
              Unify Application Security <br />
              and Vulnerability Management
            </Text>
          </div> */}
        </Col>
      </Row>
    </div>
  );
}

export default LoginPage;
