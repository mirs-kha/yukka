import React, { useEffect, useState } from 'react';
import logo from './logo-yuka.png';

function App() {
  const [barcode, setBarcode] = useState('');
  const [productData, setProductData] = useState(null);
  const [similarProductData, setSimilarProductData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      if (response.ok) {
        const data = await response.json();
        setProductData(data.product);

        if (
          data.product.ingredients_text_fr.includes('huile de palme') ||
          (data.product.nutrition_grade_fr !== 'a' && data.product.nutrition_grade_fr !== 'b')
        ) {
          const similarProductResponse = await fetch(
            `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
              data.product._keywords.join(',')
            )}&json=true`
          );
          const similarProductData = await similarProductResponse.json();
          setSimilarProductData(similarProductData.products.slice(1) || null);
        } else {
          setSimilarProductData(null);
        }
      } else {
        setError('Product not found. Please try again.');
        setProductData(null);
        setSimilarProductData(null);
      }
    } catch (error) {
      console.log('Error fetching product data:', error);
      setError('Il semble que le code barre ne soit pas bon. Veuillez réessayer.');
      setProductData(null);
      setSimilarProductData(null);
    }
  };

  const handleSearch = () => {
    if (barcode.trim() !== '') {
      setError(null);
      fetchData();
    }
  };

  if (!productData) {
    return (
      <div className='bg'>
        <img src={logo} className='logo' alt='logo' />
        <div className='emptyHome'>
          <h1>Product Data:</h1>
          <input type='text' value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder='Enter your barcode' />
          <button onClick={handleSearch}>Search</button>
          {error && <p className='error'>{error}</p>}
        </div>
      </div>
    );
  }

  const nutrimentsEntries = Object.entries(productData.nutriments);
  const nonZeroNutrimentsEntries = nutrimentsEntries.filter(([key, value]) => value !== 0);
  const hasPalmOil = productData.ingredients_text_fr.includes('huile de palme');
  const hasAllergens = productData.allergens_tags.length > 0;

  return (
    <div className='bg2'>
      <img src={logo} className='logo' alt='logo' />
      <div className='emptyHome'>
        <h1>{productData.product_name_fr}</h1>
        <input type='text' value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder='Enter your barcode' />
        <button onClick={handleSearch}>Search</button>

        <div className='presentation'>
          <div className='presentationimg'>
            {productData.image_url && <img src={productData.image_url} alt='Front Display' />}
          </div>
          <div className='presentationtext'>
            <strong>Ingredients:</strong> <br /> {productData.ingredients_text_fr}
          </div>
        </div>

        <div className='allergie'>
          <p>
            <strong>Contains allergens:</strong> {hasAllergens ? 'Yes' : 'No'}
          </p>
        </div>

        {hasAllergens && (
          <div className='allergieok'>
            <ul>
              {productData.allergens_tags.map((allergen, index) => (
                <li key={index}>{allergen}</li>
              ))}
            </ul>
          </div>
        )}

        <div className='trois'>
          <div className='nova'>
            <p>{productData.nova_groups_tags}</p>
          </div>
          <div className='score'>
            {productData.nutrition_grade_fr === 'a' || productData.nutrition_grade_fr === 'b' ? (
              <div className='bon'>{productData.nutrition_grade_fr}</div>
            ) : productData.nutrition_grade_fr === 'c' || productData.nutrition_grade_fr === 'd' ? (
              <div className='moyen'>{productData.nutrition_grade_fr}</div>
            ) : (
              <div className='mauvais'>{productData.nutrition_grade_fr}</div>
            )}
          </div>

          <div className='huile'>
            <p>
              <strong>Contains palm oil:</strong> {hasPalmOil ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        <div className='presentation'>
          <p>
            <strong>Brand:</strong> {productData.brands}
          </p>
          <p>
            <strong>Stores:</strong> {productData.stores}
          </p>
        </div>

        {similarProductData && (
          <div className='similarProduct'>
            <h2>Similar Products:</h2>
            {similarProductData.map((product, index) => (
              <div key={index}>
                <p>
                  <strong>Name:</strong> {product.product_name_fr}
                </p>
                <p>
                  <strong>Brand:</strong> {product.brands_tags.join(', ')}
                </p>
                <p>
                  <strong>Stores:</strong> {product.stores_tags.join(', ')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

