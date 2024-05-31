import propertyData from '../../../data/property.json';

export default function handler(req, res) {
    res.status(200).json(propertyData)
  }