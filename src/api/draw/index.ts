import type { ApiResult } from '../index';
import axios from 'axios';

export async function getAsset(_params) {
    return await axios.get("asset.json");
}

export async function getTools(_params) {
    return await axios.get("tools.json");
}