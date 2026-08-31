import { pb } from './pocketbase'
import type { Career } from '../types'

export async function getCareers(): Promise<Career[]> {
  return pb.collection('careers').getFullList()
}

export async function getCareerById(id: string): Promise<Career> {
  return pb.collection('careers').getOne(id)
}

export async function getCareersByBlock(block: string): Promise<Career[]> {
  return pb.collection('careers').getFullList({
    filter: `block = "${block}"`,
  })
}

export async function createCareer(data: Partial<Career>): Promise<Career> {
  return pb.collection('careers').create(data)
}

export async function updateCareer(id: string, data: Partial<Career>): Promise<Career> {
  return pb.collection('careers').update(id, data)
}

export async function deleteCareer(id: string): Promise<void> {
  await pb.collection('careers').delete(id)
}
