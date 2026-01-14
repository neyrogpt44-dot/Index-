export default async function handler(req, res) {
  const url = 'https://fireboxstore.ru/link/b2427725d518f7884093a2a43dd8702bae53552b.xml';
  try {
    const response = await fetch(url);
    const data = await response.text();
    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send("Error");
  }
}
