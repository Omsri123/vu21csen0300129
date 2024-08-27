import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PD = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://20.244.56.144/test/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center mb-8">{product.productName}</h1>
      <div className="bg-white p-6 rounded shadow-md mx-auto max-w-lg">
        <p className="mb-4"><span className="font-bold">Company:</span> {product.company}</p>
        <p className="mb-4"><span className="font-bold">Category:</span> {product.category}</p>
        <p className="mb-4"><span className="font-bold">Price:</span> {product.price}</p>
        <p className="mb-4"><span className="font-bold">Rating:</span> {product.rating}</p>
        <p className="mb-4"><span className="font-bold">Discount:</span> {product.discount}%</p>
        <p className="mb-4"><span className="font-bold">Availability:</span> {product.availability}</p>
      </div>
    </div>
  );
};

export default PD;
