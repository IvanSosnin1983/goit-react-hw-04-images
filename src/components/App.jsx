import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchImages } from './service/imagesApi';
import ImageGallery from './ImageGallery';
import Loader from './Loader';
import Button from './Button';
import Searchbar from './Searchbar';
import { Modal } from './Modal/Modal.js';

export const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoad, setIsLoad] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');

  useEffect(() => {
    if (query === '') {
      return;
    }
    async function handleFetchImages(query, page) {
      setIsLoad(true);

      try {
        const response = await fetchImages(query, page);
        if (response.data.hits.length === 0) {
          toast.error('Sorry! Nothing found. Try again');
        }
        setIsLoadMore(response.data.hits.length === 12);
        setImages(prevState => [...prevState, ...response.data.hits]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoad(false);
      }
    }
    handleFetchImages(query, page);
  }, [page, query]);

  const handleSubmit = (searchValues, { resetForm }) => {
    setQuery(searchValues);
    setPage(1);
    setImages([]);
    resetForm();
  };

  const toggleModal = largeImageURL => {
    setLargeImageURL(largeImageURL);
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <Searchbar onSubmit={handleSubmit} />
      {images.length > 0 && (
        <ImageGallery
          images={images}
          isModal={isModalOpen}
          openModal={toggleModal}
        />
      )}
      {isLoad && <Loader />}
      {isLoadMore && !isLoad && (
        <Button onClick={() => setPage(prevState => prevState + 1)} />
      )}
      <ToastContainer autoClose={1500} />
      {isModalOpen && <Modal largImage={largeImageURL} onClose={toggleModal} />}
    </>
  );
};
