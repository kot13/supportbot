<?php

namespace Products;

require_once __DIR__ . '/vendor/autoload.php';

$generator = new FeedExampleGenerator();

try {
    $offers = $generator->generateOffers();
    echo $generator->writeFile(
            new FeedFileWriteGoogle(),
            new FilePath(dirname(__DIR__, 3) . '/.vuepress/public/files/feed-example-google.xml'),
            ...$offers
        ) . PHP_EOL;

    $offers = $generator->generateOffers($generator::OFFER_AVAILABILITY_STATUSES_BOOL);
    echo $generator->writeFile(
            new FeedFileWriteYandex(),
            new FilePath(dirname(__DIR__, 3) . '/.vuepress/public/files/feed-example-yandex.xml'),
            ...$offers
        ) . PHP_EOL;

    $offers = $generator->generateOffers();
    echo $generator->writeFile(
            new FeedFileWriteCsv(),
            new FilePath(dirname(__DIR__, 3) . '/.vuepress/public/files/feed-example-csv.csv'),
            ...$offers
        ) . PHP_EOL;

} catch (\Throwable $e) {
    echo $e->getMessage() . PHP_EOL .
        $e->getFile() . ':' . $e->getLine() . PHP_EOL;
}
