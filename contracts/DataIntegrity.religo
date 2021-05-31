// Types
type id_hash = {id: string, hash: string};

type action =
| Record (id_hash)
| Delete (string);

type storage = {
  owner : address,
  hashes: big_map (string, string)
};

type return = (list (operation), storage);

// Entrypoints
let record = ((id_hash, storage) :   (id_hash, storage)) : return => {
  if (storage.owner != Tezos.sender) { failwith("Only the owner of the contract can add a new record."); };
  let hashes : big_map (string, string) = Big_map.update(id_hash.id, Some (id_hash.hash), storage.hashes);
  let storage : storage = {...storage, hashes: hashes};
  (([]: list (operation)), storage);
};

let delete = ((id, storage): (string, storage)) : return => {
  if (storage.owner != Tezos.sender)            { failwith("Only the owner of the contract can delete a record."); };
  if (Big_map.mem(id, storage.hashes) == false) { failwith("Package-id is not known!"); };
  let hashes : big_map (string, string) = Big_map.remove(id, storage.hashes);
  let storage : storage = {...storage, hashes: hashes};
  (([]: list (operation)), storage);
};

// Main
let main = ((action, storage) : (action, storage)) : return =>
  switch (action) {
    | Record (id_hash) => record ((id_hash, storage))
    | Delete (id)      => delete ((id, storage))
  };
