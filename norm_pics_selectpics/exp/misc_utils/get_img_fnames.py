import os, re
import json

path = os.getcwd()
# fname_dir = '../static/stims'
#fnames = []
fnames_listodict = []
fname_pattern = '(\S+)(\.jpg)'

for fname in os.listdir(path+'/exp/static/images/'):
    if fname.endswith('.jpg'):
        fname_naked = re.sub('\.jpg', '', fname)
        print(fname_naked)
        fnamedict = {}
        fnamedict['item'] = fname_naked
        fnames_listodict.append(fnamedict)

print(fnames_listodict)

#commenting below line so won't accidentally rewrite the stims file
#json.dump(fnames_listodict, open(path+'/exp/js/IMG_stims.js', 'w'))
