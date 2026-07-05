<?php

namespace Products;

class FeedExampleGenerator
{
    public const OFFERS_COUNT_DEFAULT = 150;
    public const OFFERS_IN_GROUP_COUNT_MIN_DEFAULT = 2;
    public const OFFERS_IN_GROUP_COUNT_MAX_DEFAULT = 5;
    public const OFFER_IMAGES_MIN_DEFAULT = 1;
    public const OFFER_IMAGES_MAX_DEFAULT = 10;
    public const OFFER_AVAILABILITY_STATUSES_DEFAULT = [
        'in_stock',
        'out_of_stock',
        'preorder',
        'backorder',
    ];
    public const OFFER_AVAILABILITY_STATUSES_BOOL = [
        'true',
        'false',
    ];

    private \Faker\Generator $faker;

    private string $lastGroupId = '';

    public function __construct()
    {
        $this->faker = \Faker\Factory::create();
    }

    /**
     * @return Offer[]
     * @throws \Throwable
     */
    public function generateOffers(
        $offerAvailabilityStatuses = self::OFFER_AVAILABILITY_STATUSES_DEFAULT,
        int $offersCount = self::OFFERS_COUNT_DEFAULT,
        int $offersInGroupCountMin = self::OFFERS_IN_GROUP_COUNT_MIN_DEFAULT,
        int $offersInGroupCountMax = self::OFFERS_IN_GROUP_COUNT_MAX_DEFAULT,
        int $offerImagesMin = self::OFFER_IMAGES_MIN_DEFAULT,
        int $offerImagesMax = self::OFFER_IMAGES_MAX_DEFAULT,
    ): array
    {
        $offersCount = 1 > $offersCount ? self::OFFERS_COUNT_DEFAULT : $offersCount;
        $offersInGroupCountMin = 1 > $offersInGroupCountMin ? self::OFFERS_IN_GROUP_COUNT_MIN_DEFAULT : $offersInGroupCountMin;
        $offersInGroupCountMax = 1 > $offersInGroupCountMax ? self::OFFERS_IN_GROUP_COUNT_MAX_DEFAULT : $offersInGroupCountMax;

        /** @var Offer[] $offers */
        $offers = [];

        $withProps = [
            'withGroup' => false,
            'withName' => true,
            'withDescription' => true,
            'withUrl' => true,
            'withSize' => true,
            'withColor' => true,
            'withAvailability' => true,
            'withPrice' => true,
            'withOldPrice' => true,
            'withImages' => true,
            'withVendor' => true,
            'withVendorCode' => true,
            'withModel' => true,
            'withAdult' => true,
        ];
        $withAllProps = true;
        $groupOffersCount = 0;
        for ($i = 0; $i < $offersCount; $i++) {
            if ($withAllProps) {
                $withAllProps = false;
                $withProps = array_map(static function () {
                    return true;
                }, $withProps);
            } else {
                $withAllProps = true;
                $withProps = array_map(static function (): bool {
                    return (bool)random_int(0, 1);
                }, $withProps);
            }

            if ($groupOffersCount) {
                $groupOffersCount--;
                $withProps['withGroup'] = true;
                $withProps['withSize'] = true;
                $withProps['withColor'] = true;
            } else if (random_int(0, 1)) {
                $withProps['withGroup'] = false;
                $groupOffersCount = random_int($offersInGroupCountMin, $offersInGroupCountMax);
            } else {
                $withProps['withGroup'] = false;
            }

            $generateParams = $withProps;
            $generateParams['imagesMin'] = $offerImagesMin;
            $generateParams['imagesMax'] = $offerImagesMax;
            $generateParams['availabilityStatuses'] = $offerAvailabilityStatuses;

            $offers[] = call_user_func_array([$this, 'generateOffer'], $generateParams);
        }

        return $offers;
    }

    /**
     * @throws \Throwable
     */
    private function generateOffer(
        bool $withGroup,
        bool $withName,
        bool $withDescription,
        bool $withUrl,
        bool $withSize,
        bool $withColor,
        bool $withAvailability,
        bool $withPrice,
        bool $withOldPrice,
        bool $withImages,
        bool $withVendor,
        bool $withVendorCode,
        bool $withModel,
        bool $withAdult,
        int $imagesMin,
        int $imagesMax,
        array $availabilityStatuses,
    ): Offer
    {
        $offerId = $this->faker->domainWord() . '-' . $this->faker->randomNumber();

        $groupId = '';
        if ($withGroup) {
            $groupId = '' !== $this->lastGroupId ? $this->lastGroupId : $this->faker->domainWord();
            $this->lastGroupId = $groupId;
        } else {
            $this->lastGroupId = '';
        }

        $name = '';
        if ($withName) {
            $name = ucfirst($this->faker->words(3, 10));
        }

        $description = '';
        if ($withDescription) {
            $description = ucfirst($this->faker->words(3, 10));
        }

        $url = '';
        if ($withUrl) {
            $url = $this->faker->url();
        }

        $size = '';
        if ($withSize) {
            $size = $this->faker->numberBetween(0, 100);
        }

        $color = '';
        if ($withColor) {
            $color = $this->faker->domainWord();
        }

        $availability = '';
        if ($withAvailability) {
            $values = $availabilityStatuses;
            $availability = $values[random_int(0, count($values) - 1)];
        }

        $price = '';
        $oldPrice = '';
        $currency = '';
        if ($withPrice || $withOldPrice) {
            $currency = $this->faker->currencyCode();
        }
        if ($withPrice || $withOldPrice) {
            $price = $this->faker->numberBetween(100, 10000) . '.' . $this->faker->numberBetween(0, 100);
        }
        if ($withOldPrice) {
            $oldPrice = $this->faker->numberBetween(100, 10000) . '.' . $this->faker->numberBetween(0, 100);
        }

        $images = [];
        if ($withImages) {
            for ($j = 1; $j < random_int($imagesMin, $imagesMax); $j++) {
                $images[] = $this->faker->imageUrl();
            }
        }

        $vendor = '';
        if ($withVendor) {
            $vendor = $this->faker->domainWord();
        }

        $vendorCode = '';
        if ($withVendorCode) {
            $vendorCode = $this->faker->domainWord();
        }

        $model = '';
        if ($withModel) {
            $model = $this->faker->domainWord();
        }

        $adult = null;
        if ($withAdult) {
            $adult = $this->faker->boolean();
        }

        return new Offer(
            $offerId,
            $groupId,
            $name,
            $description,
            $url,
            $size,
            $color,
            $availability,
            $price,
            $oldPrice,
            $currency,
            $images,
            $vendor,
            $vendorCode,
            $model,
            $adult
        );
    }

    public function writeFile(
        IFeedFileWrite $fileWrite,
        FilePath $filePath,
        Offer ...$offers,
    ): string
    {
        $fileWrite->write($filePath, ...$offers);

        return $filePath;
    }
}
