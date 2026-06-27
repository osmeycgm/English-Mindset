import jwt from 'jsonwebtoken';

const token = jwt.sign({ id: 1, email: 'test@example.com' }, 'MiClaveSuperSecreta123!', { expiresIn: '2h' });
const form = new FormData();
form.append('comprobante', new Blob(['dummyimagecontent'], { type: 'image/jpeg' }), 'dummy.jpg');
form.append('serviceName', 'Test Service');
form.append('servicePrice', '1000');
form.append('total', '1000');
form.append('cartItems', JSON.stringify([{ id: 'x', name: 'test', price: 1000 }]));
form.append('userEmail', 'test@example.com');
form.append('userId', '1');

const res = await fetch('http://localhost:5000/api/orders/transferencia', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + token
  },
  body: form
});

console.log('STATUS', res.status);
console.log('CT', res.headers.get('content-type'));
console.log(await res.text());
