import { StateCommittee } from '../types';

export interface StateInfo {
  name: string;
  code: string; // prefix like LA, FC, KN
  capital: string;
  zone: 'North Central' | 'North East' | 'North West' | 'South East' | 'South South' | 'South West';
  lgas: string[];
  campLocation: string;
}

export const NIGERIAN_STATES: StateInfo[] = [
  {
    name: 'Abia',
    code: 'AB',
    capital: 'Umuahia',
    zone: 'South East',
    lgas: ['Aba North', 'Aba South', 'Arochukwu', 'Bende', 'Ikwuano', 'Isiala Ngwa North', 'Isiala Ngwa South', 'Obi Ngwa', 'Ohafia', 'Osisioma', 'Ugwunagbo', 'Ukwa East', 'Ukwa West', 'Umuahia North', 'Umuahia South', 'Umu Nneochi'],
    campLocation: 'NYSC Permanent Orientation Camp, Umunna, Bende LGA'
  },
  {
    name: 'Abuja (FCT)',
    code: 'FC',
    capital: 'Abuja',
    zone: 'North Central',
    lgas: ['Abaji', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Municipal Area Council (AMAC)'],
    campLocation: 'NYSC Permanent Orientation Camp, Kubwa, Bwari Area Council'
  },
  {
    name: 'Adamawa',
    code: 'AD',
    capital: 'Yola',
    zone: 'North East',
    lgas: ['Demsa', 'Fufore', 'Ganye', 'Girei', 'Gombi', 'Guyuk', 'Hong', 'Jada', 'Lamurde', 'Madagali', 'Maiha', 'Mayo Belwa', 'Michika', 'Mubi North', 'Mubi South', 'Numan', 'Shelleng', 'Song', 'Toungo', 'Yola North', 'Yola South'],
    campLocation: 'NYSC Permanent Orientation Camp, Lapondo Road, Damare, Girei LGA'
  },
  {
    name: 'Akwa Ibom',
    code: 'AK',
    capital: 'Uyo',
    zone: 'South South',
    lgas: ['Abak', 'Eastern Obolo', 'Eket', 'Esit Eket', 'Essien Udim', 'Etim Ekpo', 'Etinan', 'Ibeno', 'Ibesikpo Asutan', 'Ibiono-Ibom', 'Ika', 'Ikono', 'Ikot Abasi', 'Ikot Ekpene', 'Ini', 'Itu', 'Mbo', 'Mkpat-Enin', 'Nsit-Atai', 'Nsit-Ibom', 'Nsit-Ubium', 'Obot Akara', 'Okobo', 'Onna', 'Oron', 'Oruk Anam', 'Udung-Uko', 'Ukanafun', 'Uruan', 'Urue-Offong/Oruko', 'Uyo'],
    campLocation: 'NYSC Permanent Orientation Camp, Ikot Itie Udung, Nsit Atai LGA'
  },
  {
    name: 'Anambra',
    code: 'AN',
    capital: 'Awka',
    zone: 'South East',
    lgas: ['Aguata', 'Anambra East', 'Anambra West', 'Anaocha', 'Awka North', 'Awka South', 'Ayamelum', 'Dunukofia', 'Ekwusigo', 'Idemili North', 'Idemili South', 'Ihiala', 'Njikoka', 'Nnewi North', 'Nnewi South', 'Ogbaru', 'Onitsha North', 'Onitsha South', 'Orumba North', 'Orumba South', 'Oyi'],
    campLocation: 'NYSC Permanent Orientation Camp, Umuawulu/Mbaukwu, Awka South LGA'
  },
  {
    name: 'Bauchi',
    code: 'BA',
    capital: 'Bauchi',
    zone: 'North East',
    lgas: ['Alkaleri', 'Bauchi', 'Bogoro', 'Damban', 'Darazo', 'Dass', 'Gamawa', 'Ganjuwa', 'Giade', 'Itas/Gadau', 'Jama\'are', 'Katagum', 'Kirfi', 'Misau', 'Ningi', 'Shira', 'Tafawa Balewa', 'Toro', 'Warji', 'Zaki'],
    campLocation: 'NYSC Permanent Orientation Camp, KM 60, Wailo, Ganjuwa LGA'
  },
  {
    name: 'Bayelsa',
    code: 'BY',
    capital: 'Yenagoa',
    zone: 'South South',
    lgas: ['Brass', 'Ekeremor', 'Kolokuma/Opokuma', 'Nembe', 'Ogbia', 'Sagbama', 'Southern Ijaw', 'Yenagoa'],
    campLocation: 'NYSC Permanent Orientation Camp, Kaiama Grammar School, Kolokuma/Opokuma LGA'
  },
  {
    name: 'Benue',
    code: 'BN',
    capital: 'Makurdi',
    zone: 'North Central',
    lgas: ['Ado', 'Agatu', 'Apa', 'Buruku', 'Gboko', 'Guma', 'Gwer East', 'Gwer West', 'Katsina-Ala', 'Konshisha', 'Kwande', 'Logo', 'Makurdi', 'Obi', 'Ogbadibo', 'Ohimini', 'Oju', 'Okpokwu', 'Otukpo', 'Tarka', 'Ukum', 'Ushongo', 'Vandeikya'],
    campLocation: 'NYSC Permanent Orientation Camp, Wannune, Tarka LGA'
  },
  {
    name: 'Borno',
    code: 'BO',
    capital: 'Maiduguri',
    zone: 'North East',
    lgas: ['Bama', 'Bayo', 'Biu', 'Chibok', 'Damboa', 'Dikwa', 'Gubio', 'Guzamala', 'Gwoza', 'Hawul', 'Jere', 'Kaga', 'Kala/Balge', 'Konduga', 'Kukawa', 'Kwaya Kusar', 'Mafa', 'Magumeri', 'Maiduguri', 'Marte', 'Mobbar', 'Monguno', 'Ngala', 'Nganzai', 'Shani'],
    campLocation: 'College of Peace and Disaster Management, Civil Defence Academy, Babbar-Ruga'
  },
  {
    name: 'Cross River',
    code: 'CR',
    capital: 'Calabar',
    zone: 'South South',
    lgas: ['Abi', 'Akamkpa', 'Akpabuyo', 'Bakassi', 'Bekwarra', 'Biase', 'Boki', 'Calabar Municipal', 'Calabar South', 'Etung', 'Ikom', 'Obanliku', 'Obubra', 'Obudu', 'Odukpani', 'Ogoja', 'Yakuur', 'Yala'],
    campLocation: 'NYSC Permanent Orientation Camp, Obubra, Obubra LGA'
  },
  {
    name: 'Delta',
    code: 'DT',
    capital: 'Asaba',
    zone: 'South South',
    lgas: ['Aniocha North', 'Aniocha South', 'Bomadi', 'Burutu', 'Ethiope East', 'Ethiope West', 'Ika North East', 'Ika South', 'Isoko North', 'Isoko South', 'Ndokwa East', 'Ndokwa West', 'Okpe', 'Oshimili North', 'Oshimili South', 'Patani', 'Sapele', 'Udu', 'Ughelli North', 'Ughelli South', 'Ukwuani', 'Uvwie', 'Warri North', 'Warri South', 'Warri South West'],
    campLocation: 'NYSC Permanent Orientation Camp, Issele-Uku, Aniocha North LGA'
  },
  {
    name: 'Ebonyi',
    code: 'EB',
    capital: 'Abakaliki',
    zone: 'South East',
    lgas: ['Abakaliki', 'Afikpo North', 'Afikpo South', 'Ebonyi', 'Ezza North', 'Ezza South', 'Ikwo', 'Ishielu', 'Ivo', 'Izzi', 'Ohaozara', 'Ohaukwu', 'Onicha'],
    campLocation: 'NYSC Permanent Orientation Camp, Macgregor College, Afikpo North LGA'
  },
  {
    name: 'Edo',
    code: 'ED',
    capital: 'Benin City',
    zone: 'South South',
    lgas: ['Akoko-Edo', 'Egor', 'Esan Central', 'Esan North-East', 'Esan South-East', 'Esan West', 'Etsako Central', 'Etsako East', 'Etsako West', 'Igueben', 'Ikpoba-Okha', 'Oredo', 'Orhionmwon', 'Ovia North-East', 'Ovia South-West', 'Owan East', 'Owan West', 'Uhunmwonde'],
    campLocation: 'NYSC Permanent Orientation Camp, Okada, Ovia North-East LGA'
  },
  {
    name: 'Ekiti',
    code: 'EK',
    capital: 'Ado-Ekiti',
    zone: 'South West',
    lgas: ['Ado-Ekiti', 'Efon', 'Ekiti East', 'Ekiti South-West', 'Ekiti West', 'Emure', 'Gbonyin', 'Ido-Osi', 'Ijero', 'Ikere', 'Ikole', 'Ilejemeje', 'Irepodun/Ifelodun', 'Ise/Orun', 'Moba', 'Oye'],
    campLocation: 'NYSC Permanent Orientation Camp, Ise-Orun/Emure LGA'
  },
  {
    name: 'Enugu',
    code: 'EN',
    capital: 'Enugu',
    zone: 'South East',
    lgas: ['Aninri', 'Awgu', 'Enugu East', 'Enugu North', 'Enugu South', 'Ezeagu', 'Igbo Etiti', 'Igbo Eze North', 'Igbo Eze South', 'Isi Uzo', 'Nkanu East', 'Nkanu West', 'Nsukka', 'Oji River', 'Udenu', 'Udi', 'Uzo-Uwani'],
    campLocation: 'NYSC Permanent Orientation Camp, Awgu, Awgu LGA'
  },
  {
    name: 'Gombe',
    code: 'GM',
    capital: 'Gombe',
    zone: 'North East',
    lgas: ['Akko', 'Balanga', 'Billiri', 'Dukku', 'Funakaye', 'Gombe', 'Kaltungo', 'Kwami', 'Nafada', 'Shongom', 'Yamaltu/Deba'],
    campLocation: 'NYSC Temporary Orientation Camp, Science Technical College, Amada, KM 21, Gombe-Yola Highway'
  },
  {
    name: 'Imo',
    code: 'IM',
    capital: 'Owerri',
    zone: 'South East',
    lgas: ['Aboh Mbaise', 'Ahiazu Mbaise', 'Ehime Mbano', 'Ezinihitte', 'Ideato North', 'Ideato South', 'Ihitte/Uboma', 'Ikeduru', 'Isiala Mbano', 'Isu', 'Mbaitoli', 'Ngor Okpala', 'Njaba', 'Nkwerre', 'Nwangele', 'Obowo', 'Oguta', 'Ohaji/Egbema', 'Okigwe', 'Onuimo', 'Orlu', 'Orsu', 'Oru East', 'Oru West', 'Owerri Municipal', 'Owerri North', 'Owerri West'],
    campLocation: 'NYSC Permanent Orientation Camp, Umudi, Nkwerre LGA'
  },
  {
    name: 'Jigawa',
    code: 'JG',
    capital: 'Dutse',
    zone: 'North West',
    lgas: ['Auyo', 'Babura', 'Biriniwa', 'Birnin Kudu', 'Buji', 'Dutse', 'Gagarawa', 'Garki', 'Gumel', 'Guri', 'Gwaram', 'Gwiwa', 'Hadejia', 'Jahun', 'Kafin Hausa', 'Kaugama', 'Kazaure', 'Kiri Kasama', 'Kiyawa', 'Maigatari', 'Malam Madori', 'Miga', 'Ringim', 'Roni', 'Sule Tankarkar', 'Taura', 'Yankwashi'],
    campLocation: 'NYSC Permanent Orientation Camp, Opposite Army Barracks, Fanisau, Dutse LGA'
  },
  {
    name: 'Kaduna',
    code: 'KD',
    capital: 'Kaduna',
    zone: 'North West',
    lgas: ['Birnin Gwari', 'Chikun', 'Giwa', 'Igabi', 'Ikara', 'Jaba', 'Jema\'a', 'Kachia', 'Kaduna North', 'Kaduna South', 'Kagarko', 'Kajuru', 'Kaura', 'Kauru', 'Kubau', 'Kudan', 'Lere', 'Makarfi', 'Sabon Gari', 'Sanga', 'Soba', 'Zangon Kataf', 'Zaria'],
    campLocation: 'NYSC Permanent Orientation Camp, Kaduna-Abuja Expressway, Chikun LGA'
  },
  {
    name: 'Kano',
    code: 'KN',
    capital: 'Kano',
    zone: 'North West',
    lgas: ['Ajingi', 'Albasu', 'Bagwai', 'Bebeji', 'Bichi', 'Bunkure', 'Dala', 'Dambatta', 'Dawakin Kudu', 'Dawakin Tofa', 'Doguwa', 'Fagge', 'Gabasawa', 'Garko', 'Garun Mallam', 'Gaya', 'Gezawa', 'Gwale', 'Gwarzo', 'Kabo', 'Kano Municipal', 'Karaye', 'Kibiya', 'Kiru', 'Kumbotso', 'Kunchi', 'Kura', 'Madobi', 'Makoda', 'Minjibir', 'Nasarawa', 'Rano', 'Rimin Gado', 'Rogo', 'Shanono', 'Sumaila', 'Takai', 'Tarauni', 'Tofa', 'Tsanyawa', 'Tudun Wada', 'Ungogo', 'Warawa', 'Wudil'],
    campLocation: 'NYSC Permanent Orientation Camp, Kusalla Dam, Karaye LGA'
  },
  {
    name: 'Katsina',
    code: 'KT',
    capital: 'Katsina',
    zone: 'North West',
    lgas: ['Bakori', 'Batagarawa', 'Batsari', 'Baure', 'Bindawa', 'Charanchi', 'Dan Musa', 'Dandume', 'Danja', 'Daura', 'Dutsin Ma', 'Faskari', 'Funtua', 'Ingawa', 'Jibia', 'Kafur', 'Kaita', 'Kankara', 'Kankia', 'Katsina', 'Kurfi', 'Kusada', 'Mai\'Adua', 'Malumfashi', 'Mani', 'Mashi', 'Matazu', 'Musawa', 'Rimi', 'Sabuwa', 'Safana', 'Sandamu', 'Zango'],
    campLocation: 'Youth Multi-Purpose Centre/NYSC Permanent Orientation Camp, Mani Road, Katsina'
  },
  {
    name: 'Kebbi',
    code: 'KB',
    capital: 'Birnin Kebbi',
    zone: 'North West',
    lgas: ['Aleiro', 'Arewa Dandi', 'Argungu', 'Augie', 'Bagudo', 'Birnin Kebbi', 'Bunza', 'Dandi', 'Fakai', 'Gwandu', 'Jega', 'Kalgo', 'Koko/Besse', 'Maiyama', 'Ngaski', 'Sakaba', 'Shanga', 'Suru', 'Wasagu/Danko', 'Yauri', 'Zuru'],
    campLocation: 'NYSC Permanent Orientation Camp, Dakingari, Suru LGA'
  },
  {
    name: 'Kogi',
    code: 'KG',
    capital: 'Lokoja',
    zone: 'North Central',
    lgas: ['Adavi', 'Ajaokuta', 'Ankpa', 'Bassa', 'Dekina', 'Ibaji', 'Idah', 'Igalamela-Odolu', 'Ijumu', 'Kabba/Bunu', 'Kogi', 'Lokoja', 'Mopa-Muro', 'Ofu', 'Ogori/Magongo', 'Okehi', 'Okene', 'Olamaboro', 'Omala', 'Yagba East', 'Yagba West'],
    campLocation: 'NYSC Permanent Orientation Camp, Asaya, Kabba LGA'
  },
  {
    name: 'Kwara',
    code: 'KW',
    capital: 'Ilorin',
    zone: 'North Central',
    lgas: ['Asa', 'Baruten', 'Edu', 'Ekiti', 'Ifelodun', 'Ilorin East', 'Ilorin South', 'Ilorin West', 'Irepodun', 'Isin', 'Kaiama', 'Moro', 'Offa', 'Oke Ero', 'Oyun', 'Pategi'],
    campLocation: 'NYSC Permanent Orientation Camp, Yikpata, Edu LGA'
  },
  {
    name: 'Lagos',
    code: 'LA',
    capital: 'Ikeja',
    zone: 'South West',
    lgas: ['Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry', 'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'],
    campLocation: 'NYSC Permanent Orientation Camp, Iyana-Ipaja, Alimosho LGA'
  },
  {
    name: 'Nasarawa',
    code: 'NA',
    capital: 'Lafia',
    zone: 'North Central',
    lgas: ['Akwanga', 'Awe', 'Doma', 'Karu', 'Keana', 'Keffi', 'Kokona', 'Lafia', 'Nasarawa', 'Nasarawa Egon', 'Obi', 'Toto', 'Wamba'],
    campLocation: 'Magaji Dan-Yamusa NYSC Permanent Orientation Camp, Keffi LGA'
  },
  {
    name: 'Niger',
    code: 'NG',
    capital: 'Minna',
    zone: 'North Central',
    lgas: ['Agaie', 'Agwara', 'Bida', 'Borgu', 'Bosso', 'Chanchaga', 'Edati', 'Gbako', 'Gurara', 'Katcha', 'Kontagora', 'Lapai', 'Lavun', 'Magama', 'Mariga', 'Mashegu', 'Mokwa', 'Moya', 'Paikoro', 'Rafi', 'Rijau', 'Shiroro', 'Suleja', 'Tafa', 'Wushishi'],
    campLocation: 'NYSC Permanent Orientation Camp, Paiko, Paiko LGA'
  },
  {
    name: 'Ogun',
    code: 'OG',
    capital: 'Abeokuta',
    zone: 'South West',
    lgas: ['Abeokuta North', 'Abeokuta South', 'Ado-Odo/Ota', 'Ewekoro', 'Ifo', 'Ijebu East', 'Ijebu North', 'Ijebu North East', 'Ijebu Ode', 'Ikenne', 'Ilisan-Remo', 'Imeko Afon', 'Ipokia', 'Obafemi Owode', 'Odeda', 'Odogbolu', 'Ogun Waterside', 'Remo North', 'Shagamu', 'Yewa North', 'Yewa South'],
    campLocation: 'NYSC Permanent Orientation Camp, Ikenne Road, Sagamu LGA'
  },
  {
    name: 'Ondo',
    code: 'OD',
    capital: 'Akure',
    zone: 'South West',
    lgas: ['Akoko North-East', 'Akoko North-West', 'Akoko South-East', 'Akoko South-West', 'Akure North', 'Akure South', 'Ese Odo', 'Idanre', 'Ifedore', 'Ilaje', 'Ile Oluji/Okeigbo', 'Irele', 'Odigbo', 'Okitipupa', 'Ondo East', 'Ondo West', 'Ose', 'Owo'],
    campLocation: 'NYSC Permanent Orientation Camp, Ikare-Akoko, Akoko North-East LGA'
  },
  {
    name: 'Osun',
    code: 'OS',
    capital: 'Osogbo',
    zone: 'South West',
    lgas: ['Aiyedaade', 'Aiyedire', 'Atakunmosa East', 'Atakunmosa West', 'Boluwaduro', 'Boripe', 'Ede North', 'Ede South', 'Egbedore', 'Ejigbo', 'Ife Central', 'Ife East', 'Ife North', 'Ife South', 'Ifedayo', 'Ifelodun', 'Ila', 'Ilesa East', 'Ilesa West', 'Irepodun', 'Irewole', 'Isokan', 'Iwo', 'Obokun', 'Odo Otin', 'Ola Oluwa', 'Olorunda', 'Oriade', 'Orolu', 'Osogbo'],
    campLocation: 'NYSC Permanent Orientation Camp, Adeeke, Iwo LGA'
  },
  {
    name: 'Oyo',
    code: 'OY',
    capital: 'Ibadan',
    zone: 'South West',
    lgas: ['Afijio', 'Akinyele', 'Atiba', 'Atisbo', 'Egbeda', 'Ibadan North', 'Ibadan North-East', 'Ibadan North-West', 'Ibadan South-East', 'Ibadan South-West', 'Ibarapa Central', 'Ibarapa East', 'Ibarapa North', 'Ido', 'Irepo', 'Iseyin', 'Itesiwaju', 'Iwajowa', 'Ogbomosho North', 'Ogbomosho South', 'Ogo Oluwa', 'Olorunsogo', 'Oluyole', 'Ona Ara', 'Orelope', 'Ori Ire', 'Oyo East', 'Oyo West', 'Saki East', 'Saki West', 'Surulere'],
    campLocation: 'NYSC Permanent Orientation Camp, Iseyin, Iseyin LGA'
  },
  {
    name: 'Plateau',
    code: 'PL',
    capital: 'Jos',
    zone: 'North Central',
    lgas: ['Barkin Ladi', 'Bassa', 'Bokkos', 'Jos East', 'Jos North', 'Jos South', 'Kanam', 'Kanke', 'Langtang North', 'Langtang South', 'Mangu', 'Mikang', 'Pankshin', 'Qua\'an Pan', 'Riyom', 'Shendam', 'Wase'],
    campLocation: 'NYSC Permanent Orientation Camp, Mangu, Mangu LGA'
  },
  {
    name: 'Rivers',
    code: 'RV',
    capital: 'Port Harcourt',
    zone: 'South South',
    lgas: ['Abua/Odual', 'Ahoada East', 'Ahoada West', 'Akuku-Toru', 'Andoni', 'Asari-Toru', 'Bonny', 'Degema', 'Eleme', 'Emuoha', 'Etche', 'Gokana', 'Ikwerre', 'Khana', 'Obio/Akpor', 'Ogba/Egbema/Ndoni', 'Ogu/Bolo', 'Okrika', 'Omuma', 'Opobo/Nkoro', 'Oyigbo', 'Port Harcourt', 'Tai'],
    campLocation: 'NYSC Permanent Orientation Camp, Nonwa-Gbam, Tai LGA'
  },
  {
    name: 'Sokoto',
    code: 'SO',
    capital: 'Sokoto',
    zone: 'North West',
    lgas: ['Binji', 'Bodinga', 'Dange Shuni', 'Gada', 'Goronyo', 'Gudu', 'Gawabawa', 'Illela', 'Isa', 'Kebbe', 'Kware', 'Rabah', 'Sabon Birni', 'Shagari', 'Silame', 'Sokoto North', 'Sokoto South', 'Tambuwal', 'Tangaza', 'Tureta', 'Wamako', 'Wurno', 'Yabo'],
    campLocation: 'NYSC Permanent Orientation Camp, Wamakko, Wamakko LGA'
  },
  {
    name: 'Taraba',
    code: 'TR',
    capital: 'Jalingo',
    zone: 'North East',
    lgas: ['Ardo Kola', 'Bali', 'Donga', 'Gashaka', 'Gassol', 'Ibi', 'Jalingo', 'Karim Lamido', 'Kurmi', 'Lau', 'Sardauna', 'Takum', 'Ussa', 'Wukari', 'Yorro', 'Zing'],
    campLocation: 'NYSC Permanent Orientation Camp, Sibre Airport Road, Jalingo'
  },
  {
    name: 'Yobe',
    code: 'YB',
    capital: 'Damaturu',
    zone: 'North East',
    lgas: ['Bade', 'Bursari', 'Damaturu', 'Fika', 'Fune', 'Geidam', 'Gujba', 'Gulani', 'Jakusko', 'Karasuwa', 'Machina', 'Nangere', 'Nguru', 'Potiskum', 'Tarmuwa', 'Yunusari', 'Yusufari'],
    campLocation: 'NYSC Permanent Orientation Camp, Dazigau, KM 5 Potiskum-Kano Road, Nangere LGA'
  },
  {
    name: 'Zamfara',
    code: 'ZM',
    capital: 'Gusau',
    zone: 'North West',
    lgas: ['Anka', 'Bakura', 'Birnin Magaji/Kiyaw', 'Bukkuyum', 'Bungudu', 'Gummi', 'Gusau', 'Kaura Namoda', 'Maradun', 'Maru', 'Shinkafi', 'Talata Mafara', 'Chafe', 'Zurmi'],
    campLocation: 'NYSC Permanent Orientation Camp, Beside Federal Polytechnic, Kaura Namoda'
  }
];

export const SOFT_SKILLS_OPTIONS = [
  'Python & Programming',
  'Data Analysis & PowerBI/Excel',
  'Web & Frontend Development',
  'Graphic Design & Branding',
  'Project Management & Operations',
  'Digital Marketing & Social Media',
  'Classroom Pedagogy & Teaching',
  'Content Writing & Copywriting',
  'Public Speaking & Emceeing',
  'Accounting & Financial Modeling',
  'Healthcare Assistance & First Aid',
  'Laboratory Analysis & Quality Control',
  'Legal Drafting & Research',
  'Photography & Video Editing',
  'UI/UX Design & User Research'
];

export const COURSE_CATEGORIES: Record<string, { category: string; preferredSectors: string[]; defaultDisciplines: string[] }> = {
  'Computer Science': {
    category: 'Science & Tech',
    preferredSectors: ['Information Technology & Software', 'Banking & Financial Services', 'Government Ministry / Parastatal', 'Media & Communications'],
    defaultDisciplines: ['Computer Science', 'Software Engineering', 'Information Technology']
  },
  'Software Engineering': {
    category: 'Science & Tech',
    preferredSectors: ['Information Technology & Software', 'Banking & Financial Services'],
    defaultDisciplines: ['Software Engineering', 'Computer Science']
  },
  'Accounting': {
    category: 'Management & Social Sciences',
    preferredSectors: ['Banking & Financial Services', 'Manufacturing & FMCG', 'Government Ministry / Parastatal'],
    defaultDisciplines: ['Accounting', 'Finance', 'Economics']
  },
  'Economics': {
    category: 'Management & Social Sciences',
    preferredSectors: ['Banking & Financial Services', 'Government Ministry / Parastatal', 'Education (Secondary/College)'],
    defaultDisciplines: ['Economics', 'Banking', 'Statistics']
  },
  'Business Administration': {
    category: 'Management & Social Sciences',
    preferredSectors: ['Manufacturing & FMCG', 'Banking & Financial Services', 'Information Technology & Software'],
    defaultDisciplines: ['Business Administration', 'Marketing', 'Public Admin']
  },
  'Medicine & Surgery (MBBS)': {
    category: 'Medical & Health',
    preferredSectors: ['Healthcare & Hospital'],
    defaultDisciplines: ['Medicine', 'Public Health']
  },
  'Nursing Science': {
    category: 'Medical & Health',
    preferredSectors: ['Healthcare & Hospital'],
    defaultDisciplines: ['Nursing', 'Community Health']
  },
  'Pharmacy': {
    category: 'Medical & Health',
    preferredSectors: ['Healthcare & Hospital', 'Manufacturing & FMCG'],
    defaultDisciplines: ['Pharmacy', 'Pharmacology']
  },
  'Biochemistry': {
    category: 'Science & Tech',
    preferredSectors: ['Healthcare & Hospital', 'Manufacturing & FMCG', 'Education (Secondary/College)'],
    defaultDisciplines: ['Biochemistry', 'Microbiology', 'Chemistry']
  },
  'Electrical / Electronics Engineering': {
    category: 'Engineering',
    preferredSectors: ['Engineering & Construction', 'Information Technology & Software', 'Manufacturing & FMCG'],
    defaultDisciplines: ['Electrical Engineering', 'Telecommunications', 'Mechanical Engineering']
  },
  'Mechanical Engineering': {
    category: 'Engineering',
    preferredSectors: ['Engineering & Construction', 'Manufacturing & FMCG', 'Agriculture & Agro-allied'],
    defaultDisciplines: ['Mechanical Engineering', 'Mechatronics', 'Production Engineering']
  },
  'Civil Engineering': {
    category: 'Engineering',
    preferredSectors: ['Engineering & Construction', 'Government Ministry / Parastatal'],
    defaultDisciplines: ['Civil Engineering', 'Building Technology', 'Surveying']
  },
  'Law (LL.B)': {
    category: 'Law',
    preferredSectors: ['Legal & Professional Services', 'Government Ministry / Parastatal', 'Banking & Financial Services'],
    defaultDisciplines: ['Law', 'Jurisprudence', 'Commercial Law']
  },
  'Mass Communication': {
    category: 'Arts & Humanities',
    preferredSectors: ['Media & Communications', 'Information Technology & Software', 'Education (Secondary/College)'],
    defaultDisciplines: ['Mass Communication', 'Journalism', 'Public Relations']
  },
  'English & Literary Studies': {
    category: 'Education',
    preferredSectors: ['Education (Secondary/College)', 'Media & Communications'],
    defaultDisciplines: ['English', 'Literature', 'Linguistics', 'Education']
  },
  'Mathematics / Statistics': {
    category: 'Science & Tech',
    preferredSectors: ['Banking & Financial Services', 'Information Technology & Software', 'Education (Secondary/College)'],
    defaultDisciplines: ['Mathematics', 'Statistics', 'Actuarial Science']
  },
  'Agricultural Science': {
    category: 'Agriculture',
    preferredSectors: ['Agriculture & Agro-allied', 'Government Ministry / Parastatal', 'Education (Secondary/College)'],
    defaultDisciplines: ['Agricultural Economics', 'Agronomy', 'Animal Science']
  }
};

export const NYSC_BATCH_OPTIONS = [
  '2024 Batch A Stream 1',
  '2024 Batch A Stream 2',
  '2024 Batch B Stream 1',
  '2024 Batch B Stream 2',
  '2024 Batch C Stream 1',
  '2024 Batch C Stream 2',
  '2025 Batch A Stream 1',
  '2025 Batch A Stream 2',
  '2025 Batch B Stream 1',
  '2025 Batch B Stream 2'
];

export const PRIMARY_SECTOR_OPTIONS = [
  'Education (Secondary/College)',
  'Healthcare & Medical Services',
  'Information Technology & Software',
  'Banking & Financial Services',
  'Engineering & Construction',
  'Government Ministry / Parastatal',
  'Agriculture & Agro-allied',
  'Media & Communications',
  'Legal & Professional Services',
  'Manufacturing & FMCG'
];

export const POPULAR_COURSES = [
  'Computer Science',
  'Software Engineering',
  'Information Technology',
  'Cybersecurity',
  'Electrical / Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Medicine & Surgery (MBBS)',
  'Nursing Science',
  'Pharmacy',
  'Medical Laboratory Science',
  'Biochemistry',
  'Microbiology',
  'Accounting',
  'Economics',
  'Business Administration',
  'Banking & Finance',
  'Marketing',
  'Mass Communication',
  'Law (LL.B)',
  'Political Science',
  'Public Administration',
  'Agricultural Science',
  'Animal Science & Fisheries',
  'Food Science & Technology',
  'English & Literary Studies',
  'Mathematics / Statistics',
  'Physics',
  'Chemistry',
  'Architecture',
  'Estate Management',
  'Quantity Surveying',
  'Sociology',
  'Education & Biology',
  'Education & Mathematics'
];

