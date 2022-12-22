import React, { useState } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
const api_root_url = "https://musicbrainz.org/ws/2";

function App() {
  const [query, setQuery] = useState("")
  const [coverarts, setCoverArts] = useState([])

  function handleChange(e) {
    setQuery(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault();
    coverarts.length = 0;
    setCoverArts([]);
    const entity_type = "release-group";
    var search_url = `${api_root_url}/${entity_type}`
    var artist_url = `${search_url}?query=artist:${query}&fmt=json`

    // Search for the artist requested
    fetch(artist_url).then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
      .then(function (artist_resp) {
        // Fetch CoverArt Archive
        for (const relase_group of artist_resp["release-groups"]) {
          let mbid = relase_group["id"];
          let title = relase_group["title"];
          let coverart_url = `https://coverartarchive.org/release-group/${mbid}/front-250`;

          fetch(coverart_url).then(function (response) {
            if (response.ok) {
              return response.url;
            }
          })
            .then(function (img_url) {
              if (img_url) {
                const newCoverart = { id: mbid, url: img_url, title: title };
                coverarts.push(newCoverart)
                setCoverArts([...coverarts]);
              }
            })
        }
      })
    setQuery("")
  }

  const coverartsList = coverarts.map((coverart) => (
    <div className="cover" fluid="true">
      <Image
        fluid="true"
        thumbnail="true"
        src={coverart.url}
        key={coverart.id}
        className="coverart"
        alt={coverart.title}
        title={coverart.title}
        width="250px"
        height="250px"
      />
      <p>{coverart.title}</p>
    </div>
  ));

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand href="https://github.com/Flowrey">YouTueBrainz</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Form className="d-flex" onSubmit={handleSubmit}>
              <Form.Control
                type="search"
                placeholder="Search for an Artist"
                className="me-2"
                aria-label="Search"
                value={query}
                onChange={handleChange}
              />
              <Button variant="success">Search</Button>
            </Form>
          </Navbar.Collapse>
          <div className="query">
          </div>
        </Container>
      </Navbar>
      <div className="App-coverart">
        {coverartsList}
      </div>
    </div>
  );
}

export default App;
