// Future additions:
// Make it a calendar view and have photos be displayed on top of each other and animated nicely
// View per project

import React from 'react';
import styled from 'styled-components';
import './App.css';
import { db, storage } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Container = styled.div`
  margin: 100px auto;
  padding: 20px;

  // Center the content
  max-width: 1200px; // Add a max-width to control the content width
  width: 90%; // Use percentage width for responsiveness
`;

const UploadSection = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  border: 1px dotted #ccc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  input[type="file"] {
    display: none; // Hide the actual file input
  }
`;

const UploadButton = styled.label`
  display: inline-block;
  background-color: #2A6227;
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  text-align: center;
  transition: background-color 0.3s ease;
  width: 200px;

  &:hover {
    background-color: #1e4a1c;
  }
`;

// Photo item inside the upload section
const PhotoPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    max-width: 100%;
    height: auto;
    border: 1px solid #ddd;
    margin-bottom: 10px;
  }

  button {
    background-color: #2A6227;
    color: white;
    padding: 10px 15px;
    border: none;
    cursor: pointer;
    width: 200px; // Match the image width
  }
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;

  div {
    margin-bottom: 10px;
    width: 200px; // Add fixed width for consistent sizing
  }

  label {
    display: none;
    margin-bottom: 5px;
    font-family: "Inter", sans-serif;
  }

  select {
    width: 100%;
    padding: 10px 20px;
    border: 1px solid #943E59;
    border-radius: 50px;
    font-size: 1rem;
    font-family: "Inter", sans-serif;
    transition: border-color 0.3s ease;
    color: #4C325F;
    background-color: #DFD7A8;

    &:focus {
      border-color: #B5466C; // Using your existing color theme
      outline: none;
    }

    option {
      color: #B5466C;

      &:first-child {
        color: rgba(181, 70, 108, 0.7); // Slightly transparent version for placeholder
      }
    }
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
  background-color: #B5466C;
  color: #FBF7DE;
  // For text color

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

  const handleSavePhoto = async (event) => {
      event.preventDefault();
      if (newPhoto) {
          const projectName = prompt("Enter project name:");
          if (projectName) {
            try {
              // 1. Upload image to Firebase Storage
              const storageRef = ref(storage, `photos/${newPhoto.file.name}-${Date.now()}`);
              await uploadBytes(storageRef, newPhoto.file);
              const downloadURL = await getDownloadURL(storageRef);

              // 2. Save metadata to Firestore
              const photoData = {
                projectName: projectName,
                date: new Date().toLocaleDateString(),
                imageUrl: downloadURL,
                timestamp: new Date().getTime()
              };

              await addDoc(collection(db, "photos"), photoData);

              // 3. Update local state
              setPhotos([...photos, { ...photoData, id: Date.now(), src: downloadURL }]);
              setNewPhoto(null);
            } catch (error) {
              console.error("Error saving photo:", error);
              alert("Error saving photo. Please try again.");
            }
          }
      }
  };

  // added useEffect to load photos from Firestore when component mounts
  React.useEffect(() => {
    const loadPhotos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "photos"));
        const loadedPhotos = querySnapshot.docs.map(doc => ({
          id: doc.id,
          src: doc.data().imageUrl,
          projectName: doc.data().projectName,
          date: doc.data().date
        }));
        setPhotos(loadedPhotos);
      } catch (error) {
        console.error("Error loading photos:", error);
      }
    };

    loadPhotos();
  }, []);

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
        <input
          type="file"
          id="photo-upload"
          accept="image/*"
          onChange={handlePhotoUpload}
        />
        <UploadButton htmlFor="photo-upload">
          Choose Photo
        </UploadButton>

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
