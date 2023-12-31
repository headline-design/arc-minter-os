class Arc69 {
  constructor() {
    this.algoExplorerApiBaseUrl = 'https://algoindexer.algoexplorerapi.io';
  }

  async fetch(assetId) {
    // Fetch `acfg` transactions.
    const url = `${this.algoExplorerApiBaseUrl}/v2/transactions?asset-id=${assetId}&tx-type=acfg`;
    let transactions;
    try {
      transactions = (await fetch(url).then((res) => res.json())).transactions;
    } catch (err) {
      console.error(err);
      return null;
    }

    // Sort the most recent `acfg` transactions first.
    transactions.sort((a, b) => b['round-time'] - a['round-time']);

    // Attempt to parse each `acf` transaction's note for ARC69 metadata.
    for (const transaction of transactions) {
      try {
        const noteBase64 = transaction.note;
        const noteString = atob(noteBase64)
          .trim()
          .replace(/[^ -~]+/g, '');
        const noteObject = JSON.parse(noteString);
        if (noteObject.standard === 'arc69') {
          return noteObject;
        }
      } catch (err) {
        // Oh well...
      }
    }
    return null;
  }
}

export default async function getNFTInfo(assetId) {
  // STUPIDHORSE 069
  // https://www.randgallery.com/algo-collection/?address=308075440

  // Fetch and use ARC69 metadata.
  const arc69 = new Arc69();
  let metadata = await arc69.fetch(assetId);
  return metadata;
}
