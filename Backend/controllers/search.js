import searchAlgolia from 'algoliasearch';
import dotenv from 'dotenv';
import models from '../models';
import {
  sanitize
} from '../helpers/searchSanitizer';

dotenv.config();
const {
  items, users
} = models;

export const search = async (req, res) => {
  const arrayResults = [];
  const client = searchAlgolia(process.env.ALGO_APP_ID, process.env.ALGO_SEARCH_ONLY);
  const index = client.initIndex('quinca_paradi');
  // index.clear();
  const {
    itemName,
    itemDescription,
    itemPrice,
    keyword
  } = req.query;
  try {
    const articlesResults = await items.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: users,
          as: 'owner',
          attributes: ['organization', 'description', 'profile'],
        },
      ],
    });
    articlesResults.map((e) => {
      arrayResults.push({
        id: e.id,
        itemName: e.itemName,
        itemDescription: e.itemDescription,
        itemPrice: e.itemPrice,
        itemImage: e.itemImage,
        category: e.category,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt
      });
      return arrayResults;
    });
    index.addObjects(arrayResults);
    index.search(`${itemName || itemDescription || itemPrice || keyword}`, (err, results) => {
      const sanitizedResults = sanitize(results.hits);
      if (sanitizedResults.length !== 0) {
        return res.status(200).json({
          results: sanitizedResults,
        });
      }
      return res.status(404).json({
        error: 'no results'
      });
    });
  } catch (ex) {
    console.log(ex);
    return res.status(500).json({
      error: 'something went wrong',
    });
  }
};
