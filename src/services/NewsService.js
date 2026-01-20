import api from './api';

export const getTopHeadlines = async (category = '') => {
    try {
        // Backend API: GET /api/news?category=ID
        const params = {};
        if (category && category !== 'All') {
            params.category = category;
        }

        const response = await api.get('/news', { params });
        return response.data.articles || [];
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
};

export const searchNews = async (query) => {
    try {
        const response = await api.get('/news', {
            params: { keyword: query }
        });
        return response.data.articles || [];
    } catch (error) {
        console.error('Error searching news:', error);
        return [];
    }
};

export const getForYouNews = async () => {
    try {
        const response = await api.get('/news/feed');
        return response.data;
    } catch (error) {
        console.error('Error fetching for you news:', error);
        return [];
    }
};
