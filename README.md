Timelines of Museums' African Collections and the Trans-Atlantic Slave Trade
============================================================================
> Visualizing the correlation between museums' African collections and the Trans-Atlantic Slave Trade

![A screenshot of the visualization. The top half is a bar graph showing the volume of enslaved people that were removed from the African continent by year. The bottom half shows the years object were created that are from the African collections of 5 different art museums.](/african-coll-tast.jpg)

What's the correlation between the Trans-Atlantic Slave Trade and the
items in museums' African collections? This is a visualization putting
these two pieces of data together, using publicly available museums
data from a handful of museums. 

All museum data has been aggregated and anonymized in `[data/collection.csv](blob/master/data/collection.csv)`.
Trans-Atlantic Slave Trade data provided by [slavevoyages.org](http://www.slavevoyages.org/voyage/download)

## Getting Started

All the anonymized musuem data is in a single CSV in `[data/collection.csv](blob/master/data/collection.csv)`. It's a two column file in the format:

| Year | Number of object | 
|------|------------------|
| -100 | 5                |
| 15   | 5                |
| 1993 | 5                |

To use your own museum's data, create a CSV formatted the same way and replace this file with yours. The visualization will render showing your data in the bottom half.

## About

Prepared for a demonstration at Museums and the Web 2016
