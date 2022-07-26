import { type PublicKey } from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'papaparse';

export function parseFile(filePath : any) {
  let file = filePath.target.files[0]
  return new Promise((resolve, reject) => {
    parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results, file) => {
        resolve(results.data)
      },
      error (err, file) {
        reject(err)
      } 
    })
  })
}
