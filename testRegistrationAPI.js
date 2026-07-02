const http = require('http');

// Test 1: POST Registration
const postRegistration = (studentName, studentEmail, eventId) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      studentName,
      studentEmail,
      eventId,
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = http.request('http://localhost:5000/api/registrations', options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        console.log('Raw Response:', body);
        try {
          const parsed = body ? JSON.parse(body) : body;
          resolve({
            status: res.statusCode,
            body: parsed,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: body,
          });
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

// Test 2: GET All Registrations
const getRegistrations = () => {
  return new Promise((resolve, reject) => {
    const req = http.request(
      'http://localhost:5000/api/registrations',
      { method: 'GET' },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            body: body ? JSON.parse(body) : body,
          });
        });
      }
    );

    req.on('error', reject);
    req.end();
  });
};

// Run tests
(async () => {
  try {
    console.log('========== TEST 1: POST Registration ==========');
    const postRes = await postRegistration('Sujan', 'sujan@gmail.com', '6a1ed9069dc8a5f2e2c2d2d8');
    console.log('Status:', postRes.status);
    console.log('Response:', JSON.stringify(postRes.body, null, 2));

    console.log('\n========== TEST 2: GET All Registrations ==========');
    const getRes = await getRegistrations();
    console.log('Status:', getRes.status);
    console.log('Response:', JSON.stringify(getRes.body, null, 2));
    console.log('Count:', Array.isArray(getRes.body) ? getRes.body.length : 'N/A');

    if (postRes.status === 201 && getRes.status === 200) {
      console.log('\n✅ Registration API is working correctly!');
    } else {
      console.log('\n❌ Registration API has issues');
    }
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
})();
