import smapleData from '../../../data/county.json'

export default function handler(req, res) {
    res.status(200).json(smapleData)
  }