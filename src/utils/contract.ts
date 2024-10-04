import { ContractClassResponse } from '../types/index.js';
import {
  CairoContract,
  CompiledSierra,
  LegacyCompiledContract,
  LegacyContractClass,
  SierraContractClass,
} from '../types/lib/contract/index.js';
import { CompleteDeclareContractPayload, DeclareContractPayload } from '../types/lib/index.js';
import { computeCompiledClassHash, computeContractClassHash } from './hash/index.js';
import { isString } from './typed.js';

/**
 * Checks if a given contract is in Sierra (Safe Intermediate Representation) format.
 *
 * @param {CairoContract | string} contract - The contract to check. Can be either a CairoContract object or a string representation of the contract.
 * @return {boolean} - Returns true if the contract is a Sierra contract, otherwise false.
 * @example
 * ```typescript
 * const result = isSierra(contract);
 * // result = true | false
 * ```
 */
export function isSierra(
  contract: CairoContract | string
): contract is SierraContractClass | CompiledSierra {
  const compiledContract = isString(contract) ? JSON.parse(contract) : contract;
  return 'sierra_program' in compiledContract;
}

/**
 * Extracts contract hashes from `DeclareContractPayload`.
 *
 * @param {DeclareContractPayload} payload - The payload containing contract information.
 * @return {CompleteDeclareContractPayload} - The `CompleteDeclareContractPayload` with extracted contract hashes.
 * @throws {Error} - If extraction of compiledClassHash or classHash fails.
 * @example
 * ```typescript
 * const result = extractContractHashes(contract);
 * // result = {
 * //   contract: ...,
 * //   classHash: ...,
 * //   casm: ...,
 * //   compiledClassHash: ...,
 * // }
 * ```
 */
export function extractContractHashes(
  payload: DeclareContractPayload
): CompleteDeclareContractPayload {
  const response = { ...payload } as CompleteDeclareContractPayload;

  if (isSierra(payload.contract)) {
    if (!payload.compiledClassHash && payload.casm) {
      response.compiledClassHash = computeCompiledClassHash(payload.casm);
    }
    if (!response.compiledClassHash)
      throw new Error(
        'Extract compiledClassHash failed, provide (CairoAssembly).casm file or compiledClassHash'
      );
  }

  response.classHash = payload.classHash ?? computeContractClassHash(payload.contract);
  if (!response.classHash)
    throw new Error('Extract classHash failed, provide (CompiledContract).json file or classHash');

  return response;
}
