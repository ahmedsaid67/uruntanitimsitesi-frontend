// pages/api/sitemap.xml.js
import axios from 'axios';
import { API_ROUTES } from '../../utils/constants';

const fetchCategories = async () => {
  try {
    const response = await axios.get(API_ROUTES.URUN_KATEGORI_ACTIVE);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

const fetchProducts = async () => {
  try {
    const response = await axios.get(API_ROUTES.URUNLER_ACTIVE);
    let allProducts = response.data.results;
    let nextPageUrl = response.data.next;

    while (nextPageUrl) {
      const productResponse = await axios.get(nextPageUrl);
      const productData = productResponse.data;
      allProducts = [...allProducts, ...productData.results];
      nextPageUrl = productData.next;
    }

    return allProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export default async function SitemapXml(req, res) {
  try {
    const categories = await fetchCategories();
    const products = await fetchProducts();

    const staticPages = [
      { url: 'https://flexsoft.com.tr', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 1.0 },
      { url: 'https://flexsoft.com.tr/urunlerimiz', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 0.8 },
      { url: 'https://flexsoft.com.tr/referanslar', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.6 },
      { url: 'https://flexsoft.com.tr/hakkimizda', lastmod: new Date().toISOString(), changefreq: 'yearly', priority: 0.4 },
      { url: 'https://flexsoft.com.tr/iletisim', lastmod: new Date().toISOString(), changefreq: 'yearly', priority: 0.4 },
    ];

    const dynamicPages = categories.map(category => ({
      url: `https://flexsoft.com.tr/urunlerimiz?tab=${category.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    }));

    const productPages = products.map(product => ({
      url: `https://flexsoft.com.tr/urunlerimiz?product=${product.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    }));

    const sitemapPages = [...staticPages, ...dynamicPages, ...productPages];

    const sitemapXml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemapPages
          .map(page => `
            <url>
              <loc>${page.url}</loc>
              <lastmod>${page.lastmod}</lastmod>
              <changefreq>${page.changefreq}</changefreq>
              <priority>${page.priority}</priority>
            </url>`)
          .join('')}
      </urlset>
    `;

    // Ensure no extra spaces or newlines before the XML declaration
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(sitemapXml.trim());
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).end('Error generating sitemap.');
  }
}
