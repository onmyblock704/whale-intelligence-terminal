type Cluster = {
  id: string;
  wallets: Set<string>;
};

const clusters: Cluster[] = [];

const walletMap = new Map<
  string,
  {
    counterparties: Set<string>;
    tokens: Set<string>;
  }
>();

const SIMILARITY_THRESHOLD = 2;

export function updateWalletActivity(
  wallet: string,
  counterparty?: string,
  token?: string
) {
  if (!walletMap.has(wallet)) {
    walletMap.set(wallet, {
      counterparties: new Set(),
      tokens: new Set(),
    });
  }

  const data = walletMap.get(wallet)!;

  if (counterparty) data.counterparties.add(counterparty);
  if (token) data.tokens.add(token);

  evaluateClusters(wallet);
}

function evaluateClusters(wallet: string) {
  const current = walletMap.get(wallet);
  if (!current) return;

  for (const cluster of clusters) {
    for (const w of cluster.wallets) {
      const other = walletMap.get(w);
      if (!other) continue;

      const shared =
        intersection(current.counterparties, other.counterparties) +
        intersection(current.tokens, other.tokens);

      if (shared >= SIMILARITY_THRESHOLD) {
        cluster.wallets.add(wallet);
        return;
      }
    }
  }

  clusters.push({
    id: wallet,
    wallets: new Set([wallet]),
  });
}

function intersection(a: Set<string>, b: Set<string>) {
  let count = 0;
  for (const v of a) if (b.has(v)) count++;
  return count;
}

export function getClusters() {
  return clusters.map((c) => ({
    id: c.id,
    wallets: Array.from(c.wallets),
  }));
}