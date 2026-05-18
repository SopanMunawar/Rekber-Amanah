export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
  const { amount, description, customer_name } = req.body;
  const secret = process.env.XENDIT_SECRET;
  const auth = Buffer.from(secret + ':').toString('base64');
  
  const invoice = await fetch('https://api.xendit.co/v2/invoices', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      external_id: 'rekber-' + Date.now(),
      amount: amount,
      description: description || 'Jasa Rekber Amanah',
      customer: { given_names: customer_name || 'Customer' },
      success_redirect_url: 'https://rekber-amanah.vercel.app/sukses',
      failure_redirect_url: 'https://rekber-amanah.vercel.app/gagal'
    })
  });
  const data = await invoice.json();
  res.status(200).json(data);
}