import React from 'react';
import styled from 'styled-components';
import './App.css';
import { db, storage } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Container = styled.div`
  margin: 100px 100px;
  padding: 20px;
`;

const UploadSection = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px dashed #ccc;

  input[type="file"] {
    display: block;
    margin-bottom: 10px;
  }
`;

const PhotoPreview = styled.div`
  img {
    max-width: 100%;
    height: auto;
    border: 1px solid #ddd;
    margin-bottom: 10px;
  }

  button {
    background-color: #5cb85c;
    color: white;
    padding: 10px 15px;
    border: none;
    cursor: pointer;
  }
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;

  div {
    margin-bottom: 10px;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const PhotoItem = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;

  img {
    max-width: 100%;
    height: auto;
    margin-bottom: 10px;
  }
`;

function App() {
  const [photos, setPhotos] = React.useState([]);
  const [newPhoto, setNewPhoto] = React.useState(null);
  const [projectFilter, setProjectFilter] = React.useState('');
  const [dateFilter, setDateFilter] = React.useState('');

  const handlePhotoUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setNewPhoto({
                  src: reader.result,
                  file: file
              });
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSavePhoto = (event) => {
      event.preventDefault();
      if (newPhoto) {
          const projectName = prompt("Enter project name:");
          if (projectName) {
              const newEntry = {
                  id: Date.now(),
                  src: newPhoto.src,
                  projectName: projectName,
                  date: new Date().toLocaleDateString()
              };
              setPhotos([...photos, newEntry]);
              setNewPhoto(null);
          }
      }
  };

  const handleProjectFilterChange = (event) => {
      setProjectFilter(event.target.value);
      setDateFilter(''); // Clear date filter when project filter changes
  };

  const handleDateFilterChange = (event) => {
       setDateFilter(event.target.value);
       setProjectFilter(''); // Clear project filter when date filter changes
  };


  const filteredPhotos = React.useMemo(() => {
      if (projectFilter) {
          return photos.filter(photo => photo.projectName === projectFilter);
      }
      if (dateFilter) {
           return photos.filter(photo => photo.date === dateFilter);
      }
      return photos;
  }, [photos, projectFilter, dateFilter]);

  const projectNames = [...new Set(photos.map(photo => photo.projectName))];
  const dates = [...new Set(photos.map(photo => photo.date))];

  return (
    <Container>
      <h1>Craftlog</h1>

      <UploadSection>
        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
        {newPhoto && (
          <PhotoPreview>
            <img src={newPhoto.src} alt="New Photo" style={{maxWidth: '200px'}}/>
            <button onClick={handleSavePhoto}>Save Photo</button>
          </PhotoPreview>
        )}
      </UploadSection>

      <FilterSection>
        <div>
          <label htmlFor="projectFilter">Filter by Project:</label>
          <select id="projectFilter" value={projectFilter} onChange={handleProjectFilterChange}>
            <option value="">All Projects</option>
            {projectNames.map(projectName => (
              <option key={projectName} value={projectName}>{projectName}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dateFilter">Filter by Date:</label>
          <select id="dateFilter" value={dateFilter} onChange={handleDateFilterChange}>
            <option value="">All Dates</option>
            {dates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
      </FilterSection>

      <PhotoGrid>
        {filteredPhotos.map(photo => (
          <PhotoItem key={photo.id}>
            <img src={photo.src} alt={photo.projectName} />
            <p>{photo.projectName} - {photo.date}</p>
          </PhotoItem>
        ))}
      </PhotoGrid>
    </Container>
  );
}

export default App;
