<?php

namespace Products;

readonly class Offer
{
    public string $offerId;
    public string $groupId;
    public string $name;
    public string $description;
    public string $url;
    public string $size;
    public string $color;
    public string $availability;
    public string $price;
    public string $oldPrice;
    public string $currency;
    /** @var string[] $images */
    public array $images;
    public string $vendor;
    public string $vendorCode;
    public string $model;
    public ?bool $adult;

    /**
     * @param null|string[] $images
     * @throws \InvalidArgumentException
     */
    public function __construct(
        string $offerId,
        ?string $groupId = null,
        ?string $name = null,
        ?string $description = null,
        ?string $url = null,
        ?string $size = null,
        ?string $color = null,
        ?string $availability = null,
        ?string $price = null,
        ?string $oldPrice = null,
        ?string $currency = null,
        ?array $images = null,
        ?string $vendor = null,
        ?string $vendorCode = null,
        ?string $model = null,
        ?bool $adult = null,
    )
    {
        $offerId = trim($offerId);
        if ('' === $offerId) {
            throw new \InvalidArgumentException('Offer ID is empty. Available value: non-empty string.');
        }
        $this->offerId = $offerId;

        $this->groupId = trim((string)$groupId);
        $this->name = trim((string)$name);
        $this->description = trim((string)$description);

        $url = mb_strtolower(trim((string)$url));
        if ('' !== $url) {
            $url = filter_var($url, FILTER_VALIDATE_URL);
            if (false === $url) {
                throw new \InvalidArgumentException("Invalid offer URL. Available value: URL-address.");
            }
        }
        $this->url = $url;

        $this->size = trim((string)$size);
        $this->color = trim((string)$color);
        $this->availability = trim((string)$availability);

        $price = trim((string)$price);
        if ('' !== $price && !is_numeric($price)) {
            throw new \InvalidArgumentException('Invalid price. Available value: amount, int or fractional number.');
        }
        $this->price = $price;

        $oldPrice = trim((string)$oldPrice);
        if ('' !== $oldPrice && !is_numeric($oldPrice)) {
            throw new \InvalidArgumentException('Invalid price. Available value: amount, int or fractional number.');
        }
        $this->oldPrice = $oldPrice;

        $currency = trim((string)$currency);
        if ('' !== $price || '' !== $oldPrice) {
            if ('' === $currency) {
                throw new \InvalidArgumentException('Invalid currency. Available value: currency code value, like "RUB".');
            }
        }
        $this->currency = $currency;

        $images = $images ?? [];
        $index = 0;
        foreach ($images as &$image) {
            $image = mb_strtolower(trim((string)$image));
            if ('' !== $image) {
                $image = filter_var($image, FILTER_VALIDATE_URL);
                if (false === $image) {
                    throw new \InvalidArgumentException("Invalid image URL with index $index. Available value: URL-address.");
                }
            }
            $index++;
        }
        unset($image);
        $this->images = array_diff($images, ['']);

        $this->vendor = trim((string)$vendor);
        $this->vendorCode = trim((string)$vendorCode);
        $this->model = trim((string)$model);
        $this->adult = $adult;
    }
}
