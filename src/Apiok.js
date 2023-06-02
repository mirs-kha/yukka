import React, { useEffect, useState } from 'react';
import logo from './logo-yuka.png';

function App() {
    const [barcode, setBarcode] = useState('');
    const [productData, setProductData] = useState(null);

    const fetchData = async () => {
        try {
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            const data = await response.json();
            setProductData(data.product);
        } catch (error) {
            console.log('Error fetching product data:', error);
        }
    };

    const handleSearch = () => {
        if (barcode.trim() !== '') {
            fetchData();
        }
    };

    if (!productData) {
        return (

            <div className='bg'>
                <img src={logo} className="logo" alt="logo" />
                <div className='emptyHome'>
                    <h1>Product Data:</h1>

                    <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="Entrer votre bar code" />
                    <button onClick={handleSearch}>Recherche</button>
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

            <img src={logo} className="logo" alt="logo" />
            <div className='emptyHome'>
                <h1>{productData.product_name_fr}</h1>
                <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="Entrer votre bar code" />
                <button onClick={handleSearch}>Recherche</button>




                <div className='presentation'>
                    <div className='presentationimg'>
                        {productData.image_url && (
                            <img src={productData.image_url} alt="Front Display" />
                        )}
                    </div>

                    <div className='presentationtext'>
                        <strong>Ingredients :</strong> <br /> {productData.ingredients_text_fr}
                    </div>

                </div>
            <div className='allergie'>
                <p>
                    <strong>Contient des allergens:</strong> {hasAllergens ? 'Oui' : 'Non'}
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

            </div>



















            <div className='trois'>
                <div className='nova'>
                    <p>{productData.nova_groups_tags}</p>
                </div>

                <div className='score'>
                    {
                        (productData.nutrition_grade_fr === 'a' || productData.nutrition_grade_fr === 'b') ? (
                            <div className='bon'>{productData.nutrition_grade_fr}</div>
                        ) : (
                            (productData.nutrition_grade_fr === 'c' || productData.nutrition_grade_fr === 'd') ? (
                                <div className='moyen'>{productData.nutrition_grade_fr}</div>
                            ) : (
                                <div className='mauvais'>{productData.nutrition_grade_fr}</div>
                            )
                        )
                    }
                </div>

                <div className='huile'>
                    <p>
                        <strong>Contient de l'huile de palme :</strong> {hasPalmOil ? 'Oui' : 'Non'}
                    </p>
                </div>



            </div>


		<div className='presentation'>

            <p>
                <strong>Marque:</strong> {productData.brands}
            </p>

            <p>
                <strong>Magasins:</strong> {productData.stores}
            </p>

		 </div>



        </div>






    );
}

export default App;