'use client';

import { useState } from 'react';
import axios from 'axios';

export default function UploadSpecial() {
  const [formData, setFormData] = useState({
    placeName: '',
    location: '',
    type: '',
    specialName: '',
    foodorgroc: 'Food',
    from: '',
    till: '',
    before: '',
    after: '',
    image: null as File | null
  });

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof typeof formData];
      if (key === 'image' && value) {
        data.append(key, value); // Append the file separately
      } else if (value) {
        data.append(key, value as string);
      }
    });

    try {
      // Send form data to the server
      await axios.post('/api/apispecials', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Special uploaded successfully!');
      // Reset form
      setFormData({
        placeName: '',
        location: '',
        type: '',
        specialName: '',
        foodorgroc: 'Food',
        from: '',
        till: '',
        before: '',
        after: '',
        image: null
      });
    } catch (error) {
      console.error('Error uploading special:', error);
      alert('Failed to upload special.');
    }
  };

  return (
    <div>
      <h1>Upload Special Offer</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="placeName" placeholder="Place Name" value={formData.placeName} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} required />
        <input type="text" name="specialName" placeholder="Special Name" value={formData.specialName} onChange={handleChange} required />
        <select name="foodorgroc" value={formData.foodorgroc} onChange={handleChange}>
          <option value="Food">Food</option>
          <option value="Groc">Groceries</option>
          <option value="Both">Both</option>
        </select>
        <input type="text" name="from" placeholder="Valid From" value={formData.from} onChange={handleChange} required />
        <input type="text" name="till" placeholder="Valid Till" value={formData.till} onChange={handleChange} required />
        <input type="number" name="before" placeholder="Original Price" value={formData.before} onChange={handleChange} required />
        <input type="number" name="after" placeholder="Discounted Price" value={formData.after} onChange={handleChange} required />
        <input type="file" name="image" accept="image/*" onChange={handleImageChange} required />
        <button type="submit">Upload Special</button>
      </form>
    </div>
  );
}
