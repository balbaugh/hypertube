import axios from 'axios';

const API_URL = 'https://archive.org/advancedsearch.php?q=';

const searchTorrents = async (query) => {
    // const response = await axios.get(`${API_URL}${query}&fl[]=identifier&fl[]=title&fl[]=downloads&fl[]=mediatype&fl[]=format&fl[]=subject&sort[]=&sort[]=&sort[]=&rows=50&page=1&callback=callback&save=yes&output=json&api_key=6SL9PdmSpyXys5p0`);
    // const response = await axios.get(`${API_URL}${query}&fl[]=identifier&fl[]=title&fl[]=downloads&fl[]=mediatype&fl[]=format&fl[]=subject&format=Torrent&mediatype=movies&sort[]=&sort[]=&sort[]=&rows=50&page=1&callback=callback&save=yes&output=json&api_key=6SL9PdmSpyXys5p0`);
    const response = await axios.get(`${API_URL}${query}&fl[]=identifier&fl[]=title&fl[]=downloads&fl[]=mediatype&fl[]=format&fl[]=subject&fl[]=cover_image&fl[]=torrent_link&format=Torrent&mediatype=movies&sort[]=&sort[]=&sort[]=&rows=50&page=1&callback=callback&save=yes&output=json&api_key=6SL9PdmSpyXys5p0`);
    return response.data;
};

export default searchTorrents;
