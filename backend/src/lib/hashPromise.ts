/**
 * this library promisifies ronomomon's crypto-async's hash
 */

import cryptoAsync from "@ronomon/crypto-async";

export const hashPromise = (
    algorithm: string,
    source: Buffer
): Promise<Buffer> =>
    new Promise((resolve, reject) => {
        cryptoAsync.hash(algorithm, source, function (error, hash) {
            if (error) {
                reject(error);
                return;
            }
            resolve(hash);
        });
    });
