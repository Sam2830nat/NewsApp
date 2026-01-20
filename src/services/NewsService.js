const API_KEY = 'ca632593a5234defad66c18d94576b44'; // Using the key from your previous project
const BASE_URL = 'https://newsapi.org/v2';

export const getTopHeadlines = async (category = 'general') => {
    try {
        const response = await fetch(
            `${BASE_URL}/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
        );
        const json = await response.json();
        return json.articles || [];
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
};

export const searchNews = async (query) => {
    try {
        const response = await fetch(
            `${BASE_URL}/everything?q=${query}&apiKey=${API_KEY}`
        );
        const json = await response.json();
        return json.articles || [];
    } catch (error) {
        console.error('Error searching news:', error);
        return [];
    }
};
