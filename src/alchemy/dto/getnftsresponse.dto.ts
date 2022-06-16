import {
  GetNftsResponse,
  Nft,
  NftContract,
  NftId,
  NftMedia,
  NftMetadata,
  NftTokenMetadata,
  TokenUri,
} from '@alch/alchemy-web3';
import { ApiProperty } from '@nestjs/swagger';

class NftContractDTO implements NftContract {
  @ApiProperty({
    description: 'address of NFT contract.',
  })
  address: string;
}

class NftTokenMetadataDTO implements NftTokenMetadata {
  @ApiProperty({
    enum: ['ERC721', 'ERC1155'],
    description: '"ERC721" or "ERC1155".',
  })
  tokenType: 'erc721' | 'erc1155';
}

class TokenIDDTO implements NftId {
  @ApiProperty({
    description: 'Id for NFT (hex).',
  })
  tokenId: string;

  @ApiProperty({
    type: NftTokenMetadataDTO,
  })
  tokenMetadata?: NftTokenMetadata;
}

class NftMetadataDTO implements NftMetadata {
  @ApiProperty({
    description: 'Name of the NFT asset.',
  })
  name?: string;

  @ApiProperty({
    description:
      'human-readable description of the NFT asset. (Markdown is supported/rendered on OpenSea and other NFT platforms).',
  })
  description?: string;

  @ApiProperty({
    description:
      'URL to the NFT asset image. Can be standard URLs pointing to images on conventional servers, IPFS, or Arweave. Most types of images (SVGs, PNGs, JPEGs, etc.) are supported by NFT marketplaces.',
  })
  image?: string;

  @ApiProperty({
    description: 'traits/attributes/characteristics for each NFT asset.',
  })
  attributes?: Array<Record<string, any>>;
}

class TokenUriDTO implements TokenUri {
  @ApiProperty({
    description:
      'uri representing the location of the NFTs original metadata blob. This is a backup for you to parse when the metadata field is not automatically populated.',
  })
  raw: string;
  @ApiProperty({
    description: 'public gateway uri for the raw uri above.',
  })
  gateway: string;
}

class NFTAssetDTO implements Nft {
  @ApiProperty({
    description: 'Name of the NFT asset.',
  })
  title: string;

  @ApiProperty({
    description: 'Brief human-readable description.',
  })
  description: string;

  @ApiProperty({
    type: TokenUriDTO,
  })
  tokenUri?: TokenUri;

  @ApiProperty({
    isArray: true,
    type: TokenUriDTO,
  })
  media?: NftMedia[];

  @ApiProperty({
    description:
      'relevant metadata for NFT contract. This is useful for viewing image url, traits, etc. without having to follow the metadata url in tokenUri to parse manually.',
    type: NftMetadataDTO,
  })
  metadata?: NftMetadata;

  @ApiProperty({
    description: 'Fetch time.',
  })
  timeLastUpdated: string;

  @ApiProperty({
    description:
      'A string describing a particular reason that we were unable to fetch complete metadata for the NFT.',
  })
  error?: string;

  @ApiProperty({
    description: 'Token balance.',
  })
  balance: string;

  @ApiProperty({
    description: 'Token balance.',
    type: TokenIDDTO,
  })
  id: NftId;

  @ApiProperty({
    description: 'Token balance.',
    type: NftContractDTO,
  })
  contract: NftContract;
}

export class GetNFTAssetsResponseDTO implements GetNftsResponse {
  @ApiProperty({
    description: 'The list of NFTs.',
    isArray: true,
    type: NFTAssetDTO,
  })
  ownedNfts: Nft[];

  @ApiProperty({
    description: 'Include pagination key if exists.',
  })
  pageKey?: string;

  @ApiProperty({
    description: 'The total number of nfts list (differ from the NFTs length).',
  })
  totalCount: number;
}
