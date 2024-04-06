/**
 * Maps rating data to a format suitable for charts and tables.
 *
 * @param {Object} ratingData - The rating data object to map.
 * @return {Array} The mapped array of data suitable for charts and tables.
 */
const mapRatingDataToChart = (ratingData) => {
    if (!ratingData || typeof ratingData !== 'object' || Array.isArray(ratingData)) {
        return [];
    }

    const excludedKeys = ['_id', 'brew', 'createdAt', 'updatedAt', '__v'];

    return Object.keys(ratingData)
        .filter(key => !excludedKeys.includes(key))
        .map(key => ({
            attributeName: key,
            value: ratingData[key],
        }));
};

export default mapRatingDataToChart;
