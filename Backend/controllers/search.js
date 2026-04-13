import searchAlgolia from 'algoliasearch';
import dotenv from 'dotenv';
import models from '../models';
import {
  sanitize
} from '../helpers/searchSanitizer';
import {
  sendSuccess,
  sendError,
} from '../helpers/responseHelper';

dotenv.config();
const {
  items, users
} = models;

export const search = async (req, res) => {
  const arrayResults = [];
  const client = searchAlgolia(process.env.ALGO_APP_ID, process.env.ADMIN_KEY);
  const index = client.initIndex('quinca_paradi');
  // index.clear();
  // client.clearCache();
  const {
    itemName,
  } = req.query;
  try {
    const itemsResults = await items.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: users,
          as: 'owner',
          attributes: ['organization', 'description', 'profile'],
        },
      ],
    });
    itemsResults.map((e) => {
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
    index.search(`${itemName}`, (err, results) => {
      if (err) return sendError(res, 'Search failed', 500, err.message);
      const sanitizedResults = sanitize(results.hits);
      if (sanitizedResults.length !== 0) {
        return sendSuccess(res, sanitizedResults, 'Search successful', 200, null, {
          results: sanitizedResults,
        });
      }
      return sendError(res, 'no results', 404);
    });
  } catch (ex) {
    return sendError(res, 'something went wrong', 500, ex.message);
  }
};
