# Get some stats about your Etherpad lite instance

Just install the plugin and go to http://pad.example.org/stats.json.

The result is a json string like:

```
{"timestamp": 1425992868, "padsCount": 2, "blankPads": 1}
```

The `blankPads` counter may be inaccurate at Etherpad startup since the plugin fills a cache asynchronously.  
After the startup, the cache is updated in real time (on pad creation, update or deletion) so it's always accurate.

If you have too many pads, Etherpad may not be able to list all pads. As this plugin relies on listAllPads API call, it will fail.

# License

Copyright 2015 Luc Didry

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
