export default async function handler(req, res) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 24);

    const XML_URL = 'https://fireboxstore.ru/link/b2427725d518f7884093a2a43dd8702bae53552b.xml';

    const response = await fetch(XML_URL);
    const xml = await response.text();

    const offers = xml.match(/<offer[\s\S]*?<\/offer>/g) || [];

    const start = (page - 1) * limit;
    const chunk = offers.slice(start, start + limit);

    const products = chunk.map(o => ({
      name: (o.match(/<name>(.*?)<\/name>/) || [,''])[1],
      price: (o.match(/<price>(.*?)<\/price>/) || [,''])[1],
      url: (o.match(/<url>(.*?)<\/url>/) || [,''])[1],
      image: (o.match(/<picture>(.*?)<\/picture>/) || [,''])[1]
    }));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
}
