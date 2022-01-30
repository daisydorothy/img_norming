
library(dplyr)
library(tidyr)
library(stringr)
library(lexicon)


norms <- read.csv('/Users/daisy/Desktop/useful_tools/glasgow_norms.csv')

colnames(norms) <- c("words", "length", "arous_mean", "arous_sd", "arous_N", "val_mean", "val_sd", "val_n", "dom_mean", "dom_sd", "dom_N", "cnc_mean", "cnc_sd", "cnc_n", "imag_mean", "imag_sd", "imag_n", "fam_mean", "fam_sd", "fam_n", "aoa_mean", "aoa_sd", "aoa_n", "size_mean", "size_sd", "size_n", "gend_mean", "gend_sd", "gend_n")
norms <- norms[-c(1), ]

as.numeric.factor <- function(x) {as.numeric(levels(x))[x]} #can't convert to numeric from factor implicitly

cols_to_numerize <- c(3:29)
norms <- norms %>%
  mutate_at(cols_to_numerize, as.numeric.factor)

norms

