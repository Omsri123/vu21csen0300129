import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AP = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    company: 'AMZ',
    category: 'Laptop',
    minPrice: 1,
    maxPrice: 10000,
    top: 10,
  });

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://20.244.56.144/test/companies/${filters.company}/categories/${filters.category}/products`, {
          params: {
            top: filters.top,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredProducts = products.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 md:mb-8">Top Products</h1>
      <div className="flex flex-col md:flex-row justify-center mb-4 md:mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <label className="flex flex-col md:flex-row items-center">
          <span className="mr-2">Company:</span>
          <select name="company" onChange={handleFilterChange} className="p-2 border rounded">
            <option value="AMZ">AMZ</option>
            <option value="FLP">FLP</option>
            <option value="SNP">SNP</option>
            <option value="HYN">HYN</option>
            <option value="AZO">AZO</option>
          </select>
        </label>
        <label className="flex flex-col md:flex-row items-center">
          <span className="mr-2">Category:</span>
          <select name="category" onChange={handleFilterChange} className="p-2 border rounded">
            <option value="Laptop">Laptop</option>
            <option value="Phone">Phone</option>
            <option value="TV">TV</option>
            <option value="Earphone">Earphone</option>
          </select>
        </label>
        <label className="flex flex-col md:flex-row items-center">
          <span className="mr-2">Min Price:</span>
          <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} className="p-2 border rounded" />
        </label>
        <label className="flex flex-col md:flex-row items-center">
          <span className="mr-2">Max Price:</span>
          <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} className="p-2 border rounded" />
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <div key={product.productId} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg md:text-xl font-bold">{product.productName}</h2>
            <p>Price: {product.price}</p>
            <p>Rating: {product.rating}</p>
            <p>Discount: {product.discount}%</p>
            <p>Availability: {product.availability}</p>
            <a href={`/product/${product.productId}`} className="text-blue-500 hover:underline">View Details</a>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} className="px-4 py-2 bg-blue-500 text-white rounded mr-2">Previous</button>
        <button onClick={() => setPage((prev) => prev + 1)} className="px-4 py-2 bg-blue-500 text-white rounded">Next</button>
      </div>
    </div>
  );
};

export default AP;
