import type { ProductFilterState } from '@/types/ProductFilter';

export function buildProductQuery(filters: ProductFilterState) {
  return {
    category: filters.category,

    brand: filters.brands.length ? filters.brands : undefined,

    colors: filters.colors.length ? filters.colors : undefined,

    ratings: filters.ratings.length ? filters.ratings : undefined,

    minPrice: filters.minPrice,

    maxPrice: filters.maxPrice,

    availability: filters.availability ? true : undefined,

    ram: filters.ram.length ? filters.ram : undefined,

    storage: filters.storage.length ? filters.storage : undefined,

    operatingSystem: filters.operatingSystem.length
      ? filters.operatingSystem
      : undefined,

    screenSize: filters.screenSize.length ? filters.screenSize : undefined,

    cpu: filters.cpu.length ? filters.cpu : undefined,

    gpu: filters.gpu.length ? filters.gpu : undefined,

    usageType: filters.usageType.length ? filters.usageType : undefined,

    connectionType: filters.connectionType.length
      ? filters.connectionType
      : undefined,

    bluetooth: filters.bluetooth ? true : undefined,

    noiseCancellation: filters.noiseCancellation ? true : undefined,

    microphone: filters.microphone ? true : undefined,

    panelType: filters.panelType.length ? filters.panelType : undefined,

    resolution: filters.resolution.length ? filters.resolution : undefined,

    refreshRate: filters.refreshRate.length ? filters.refreshRate : undefined,

    hdr: filters.hdr ? true : undefined,

    camera: filters.camera.length ? filters.camera : undefined,
  };
}
