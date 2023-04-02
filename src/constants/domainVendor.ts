import * as Api from '@/api';
export const VendorNameMap: Record<Api.Domain.DomainVendor, string> = {
  [Api.Domain.DomainVendorMap.aliyun]: '阿里云',
  [Api.Domain.DomainVendorMap.dnspod]: '腾讯云(DNSpod)',
  [Api.Domain.DomainVendorMap.cloudflare]: 'Cloudflare',
};
