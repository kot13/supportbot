<?php

namespace Products;

class FeedFileWriteCsv implements IFeedFileWrite
{
    public const FIELDS_SEPARATOR = ',';

    public function write(FilePath $path, Offer ...$offers): void
    {
        $lines = $this->generateLines(...$offers);
        $this->writeFile($path, $lines);
    }

    private function generateLines(Offer ...$offers): array
    {
        $offersContent = [
            [
                'id' => 'id',
                'group' => 'group',
                'title' => 'title',
                'description' => 'description',
                'url' => 'url',
                'size' => 'size',
                'color' => 'color',
                'price' => 'price',
                'old price' => 'old price',
                'currency' => 'currency',
                'image' => 'image',
            ],
        ];
        foreach ($offers as $offer) {
            $offersContent[] = $this->generateOffer($offer);
        }

        return $offersContent;
    }

    private function generateOffer(Offer $offer): array
    {
        $data['id'] = $offer->offerId;
        $data['group'] = $offer->groupId;
        $data['title'] = $offer->name;
        $data['description'] = $offer->description;
        $data['url'] = $offer->url;
        $data['size'] = $offer->size;
        $data['color'] = $offer->color;
        $data['currency'] = $offer->currency;
        $data['price'] = $offer->price;
        $data['old price'] = $offer->oldPrice;
        $data['image'] = implode(',', $offer->images);

        return $data;
    }

    private function writeFile(FilePath $path, array $lines): void
    {
        $fileHandler = fopen($path, 'wb');
        foreach ($lines as $line) {
            $fileRow = [
                $line['id'],
                $line['group'],
                $line['title'],
                $line['description'],
                $line['url'],
                $line['size'],
                $line['color'],
                $line['price'],
                $line['old price'],
                $line['currency'],
                $line['image'],
            ];

            fputcsv($fileHandler, $fileRow, self::FIELDS_SEPARATOR);
        }
        fclose($fileHandler);
    }
}
