
"use client";

import { useState, useEffect } from 'react';
import {
  Bold, Italic, Underline, Wand2, Image as ImageIcon,
  Type, Paintbrush, Settings, RotateCw, ChevronsUpDown, Undo, Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SuggestStyleOutput } from '@/ai/flows/suggest-style';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const popularFonts = [
    'ABeeZee', 'Abel', 'Abhaya Libre', 'Abril Fatface', 'Aclonica', 'Acme', 'Actor', 'Adamina', 'Advent Pro', 'Aguafina Script', 'Akaya Kanadaka', 'Akaya Telivigala', 'Akronim', 'Aladin', 'Alata', 'Alatsi', 'Aldrich', 'Alef', 'Alegreya', 'Alegreya SC', 'Alegreya Sans', 'Alegreya Sans SC', 'Aleo', 'Alex Brush', 'Alfa Slab One', 'Alice', 'Alike', 'Alike Angular', 'Allan', 'Allerta', 'Allerta Stencil', 'Allura', 'Almarai', 'Almendra', 'Almendra Display', 'Almendra SC', 'Amarante', 'Amaranth', 'Amatic SC', 'Amethysta', 'Amiko', 'Amiri', 'Amita', 'Anaheim', 'Andada', 'Andika', 'Angkor', 'Annie Use Your Telescope', 'Anonymous Pro', 'Antic', 'Antic Didone', 'Antic Slab', 'Anton', 'Antonio', 'Anybody', 'Arapey', 'Arbutus', 'Arbutus Slab', 'Architects Daughter', 'Archivo', 'Archivo Black', 'Archivo Narrow', 'Aref Ruqaa', 'Arima Madurai', 'Arimo', 'Arizonia', 'Armata', 'Arsenal', 'Artifika', 'Arvo', 'Arya', 'Asap', 'Asap Condensed', 'Asar', 'Asset', 'Assistant', 'Astloch', 'Asul', 'Athiti', 'Atkinson Hyperlegible', 'Atma', 'Atomic Age', 'Aubrey', 'Audiowide', 'Autour One', 'Average', 'Average Sans', 'Averia Gruesa Libre', 'Averia Libre', 'Averia Sans Libre', 'Averia Serif Libre', 'B612', 'B612 Mono', 'Bad Script', 'Bahiana', 'Bahianita', 'Bai Jamjuree', 'Ballet', 'Baloo 2', 'Baloo Bhai 2', 'Baloo Bhaina 2', 'Baloo Chettan 2', 'Baloo Da 2', 'Baloo Paaji 2', 'Baloo Tamma 2', 'Baloo Tammudu 2', 'Baloo Thambi 2', 'Balsamiq Sans', 'Balthazar', 'Bangers', 'Barlow', 'Barlow Condensed', 'Barlow Semi Condensed', 'Barriecito', 'Barrio', 'Basic', 'Baskervville', 'Battambang', 'Baumans', 'Bayon', 'Be Vietnam Pro', 'Bebas Neue', 'Belgrano', 'Bellefair', 'Belleza', 'Bellota', 'Bellota Text', 'BenchNine', 'Benne', 'Bentham', 'Berkshire Swash', 'Besley', 'Beth Ellen', 'Bevan', 'Big Shoulders Display', 'Big Shoulders Inline Display', 'Big Shoulders Inline Text', 'Big Shoulders Stencil Display', 'Big Shoulders Stencil Text', 'Big Shoulders Text', 'Bigelow Rules', 'Bigshot One', 'Bilbo', 'Bilbo Swash Caps', 'BioRhyme', 'BioRhyme Expanded', 'Birthstone', 'Birthstone Bounce', 'Biryani', 'Bitter', 'Black And White Picture', 'Black Han Sans', 'Black Ops One', 'Blinker', 'Bodoni Moda', 'Bokor', 'Bonbon', 'Boogaloo', 'Bowlby One', 'Bowlby One SC', 'Brawler', 'Bree Serif', 'Brygada 1918', 'Bubblegum Sans', 'Bubbler One', 'Buda', 'Buenard', 'Bungee', 'Bungee Hairline', 'Bungee Inline', 'Bungee Outline', 'Bungee Shade', 'Butcherman', 'Butterfly Kids', 'Cabin', 'Cabin Condensed', 'Cabin Sketch', 'Caesar Dressing', 'Cagliostro', 'Cairo', 'Caladea', 'Calistoga', 'Calligraffitti', 'Cambay', 'Cambo', 'Candal', 'Cantarell', 'Cantata One', 'Cantora One', 'Capriola', 'Cardo', 'Carme', 'Carrois Gothic', 'Carrois Gothic SC', 'Carter One', 'Castoro', 'Catamaran', 'Caudex', 'Caveat', 'Caveat Brush', 'Cedarville Cursive', 'Ceviche One', 'Chakra Petch', 'Changa', 'Changa One', 'Chango', 'Charm', 'Charmonman', 'Chathura', 'Chau Philomene One', 'Chela One', 'Chelsea Market', 'Chenla', 'Cherish', 'Cherry Cream Soda', 'Cherry Swash', 'Chewy', 'Chicle', 'Chilanka', 'Chivo', 'Chonburi', 'Cinzel', 'Cinzel Decorative', 'Clicker Script', 'Coda', 'Coda Caption', 'Codystar', 'Coiny', 'Combo', 'Comfortaa', 'Comforter', 'Comforter Brush', 'Comic Neue', 'Coming Soon', 'Commissioner', 'Concert One', 'Condiment', 'Content', 'Contrail One', 'Convergence', 'Cookie', 'Copse', 'Corben', 'Cormorant', 'Cormorant Garamond', 'Cormorant Infant', 'Cormorant SC', 'Cormorant Unicase', 'Cousine', 'Coustard', 'Covered By Your Grace', 'Crafty Girls', 'Creepster', 'Crete Round', 'Crimson Pro', 'Crimson Text', 'Croissant One', 'Crushed', 'Cuprum', 'Cute Font', 'Cutive', 'Cutive Mono', 'DM Mono', 'DM Sans', 'DM Serif Display', 'DM Serif Text', 'Damion', 'Dancing Script', 'Dangrek', 'Darker Grotesque', 'David Libre', 'Dawning of a New Day', 'Days One', 'Dekko', 'Dela Gothic One', 'Delius', 'Delius Swash Caps', 'Delius Unicase', 'Della Respira', 'Denk One', 'Devonshire', 'Dhurjati', 'Didact Gothic', 'Diplomata', 'Diplomata SC', 'Do Hyeon', 'Dokdo', 'Domine', 'Donegal One', 'Doppio One', 'Dorsa', 'Dosis', 'DotGothic16', 'Dr Sugiyama', 'Duru Sans', 'Dynalight', 'EB Garamond', 'Eagle Lake', 'East Sea Dokdo', 'Eater', 'Economica', 'Eczar', 'El Messiri', 'Electrolize', 'Elsie', 'Elsie Swash Caps', 'Emblema One', 'Emilys Candy', 'Encode Sans', 'Encode Sans Condensed', 'Encode Sans Expanded', 'Encode Sans Semi Condensed', 'Encode Sans Semi Expanded', 'Engagement', 'Englebert', 'Enriqueta', 'Ephesis', 'Epilogue', 'Erica One', 'Esteban', 'Estonia', 'Euphoria Script', 'Ewert', 'Exo', 'Exo 2', 'Expletus Sans', 'Explora', 'Fahkwang', 'Fanwood Text', 'Farro', 'Farsan', 'Fascinate', 'Fascinate Inline', 'Faster One', 'Fasthand', 'Fauna One', 'Faustina', 'Federant', 'Federo', 'Felipa', 'Fenix', 'Finger Paint', 'Fino Sans', 'Fino Serif', 'Fira Code', 'Fira Mono', 'Fira Sans', 'Fira Sans Condensed', 'Fira Sans Extra Condensed', 'Fjalla One', 'Fjord One', 'Flamenco', 'Flavors', 'Fleur De Leah', 'Flow Block', 'Flow Circular', 'Flow Rounded', 'Fondamento', 'Fontdiner Swanky', 'Forum', 'Francois One', 'Frank Ruhl Libre', 'Fraunces', 'Freckle Face', 'Fredericka the Great', 'Fredoka One', 'Freehand', 'Fresca', 'Frijole', 'Fruktur', 'Fugaz One', 'Fuggles', 'Gideon Roman', 'Gidugu', 'Gilda Display', 'Girassol', 'Give You Glory', 'Glass Antiqua', 'Glegoo', 'Gloria Hallelujah', 'Glory', 'Gluten', 'Goblin One', 'Gochi Hand', 'Goldman', 'Gorditas', 'Gothic A1', 'Gotu', 'Goudy Bookletter 1911', 'Gowun Batang', 'Gowun Dodum', 'Graduate', 'Grand Hotel', 'Grandstander', 'Grape Nuts', 'Gravitas One', 'Great Vibes', 'Grechen Fuemen', 'Grenze', 'Grenze Gotisch', 'Grey Qo', 'Griffy', 'Gruppo', 'Gudea', 'Gugi', 'Gupter', 'Gurajada', 'Gwendolyn', 'Habibi', 'Hachi Maru Pop', 'Halant', 'Hammersmith One', 'Hanalei', 'Hanalei Fill', 'Handlee', 'Hanuman', 'Happy Monkey', 'Harmattan', 'Headland One', 'Heba', 'Heebo', 'Henny Penny', 'Hepta Slab', 'Herr Von Muellerhoff', 'Hi Melody', 'Hina Mincho', 'Hind', 'Hind Guntur', 'Hind Madurai', 'Hind Siliguri', 'Hind Vadodara', 'Holtwood One SC', 'Homemade Apple', 'Homenaje', 'Hubballi', 'Hurricane', 'IBM Plex Mono', 'IBM Plex Sans', 'IBM Plex Sans Arabic', 'IBM Plex Sans Condensed', 'IBM Plex Sans Devanagari', 'IBM Plex Sans Hebrew', 'IBM Plex Sans KR', 'IBM Plex Sans Thai', 'IBM Plex Sans Thai Looped', 'IBM Plex Serif', 'IM Fell DW Pica', 'IM Fell DW Pica SC', 'IM Fell Double Pica', 'IM Fell Double Pica SC', 'IM Fell English', 'IM Fell English SC', 'IM Fell French Canon', 'IM Fell French Canon SC', 'IM Fell Great Primer', 'IM Fell Great Primer SC', 'Ibarra Real Nova', 'Iceberg', 'Iceland', 'Imbue', 'Imperial Script', 'Imprima', 'Inconsolata', 'Inder', 'Indie Flower', 'Ingrid Darling', 'Inika', 'Inknut Antiqua', 'Inria Sans', 'Inria Serif', 'Inter', 'Irish Grover', 'Istok Web', 'Italiana', 'Italianno', 'Itim', 'Jacques Francois', 'Jacques Francois Shadow', 'Jaldi', 'JetBrains Mono', 'Jim Nightshade', 'Jockey One', 'Jolly Lodger', 'Jomhuria', 'Jomolhari', 'Josefin Sans', 'Josefin Slab', 'Jost', 'Joti One', 'Jua', 'Judson', 'Julee', 'Julius Sans One', 'Junge', 'Jura', 'Just Another Hand', 'Just Me Again Down Here', 'K2D', 'Kadwa', 'Kaisei Decol', 'Kaisei HarunoUmi', 'Kaisei Opti', 'Kaisei Tokumin', 'Kalam', 'Kameron', 'Kanit', 'Kantumruy', 'Karantina', 'Karla', 'Karma', 'Katibeh', 'Kaushan Script', 'Kavivanar', 'Kavoon', 'Kdam Thmor Pro', 'Keania One', 'Kelly Slab', 'Kenia', 'Khand', 'Khmer', 'Khula', 'Kirang Haerang', 'Kite One', 'Kiwi Maru', 'Klee One', 'Knewave', 'KoHo', 'Kodchasan', 'Koh Santepheap', 'Kosugi', 'Kosugi Maru', 'Kotta One', 'Koulen', 'Kranky', 'Kreon', 'Kristi', 'Krona One', 'Krub', 'Kufam', 'Kulim Park', 'Kumar One', 'Kumar One Outline', 'Kumbh Sans', 'Kurale', 'La Belle Aurore', 'Lacquer', 'Laila', 'Lakki Reddy', 'Lalezar', 'Lancelot', 'Langar', 'Lateef', 'Lato', 'Lavishly Yours', 'League Script', 'Leckerli One', 'Ledger', 'Lekton', 'Lemon', 'Lemonada', 'Lexend', 'Lexend Deca', 'Lexend Exa', 'Lexend Giga', 'Lexend Mega', 'Lexend Peta', 'Lexend Tera', 'Lexend Zetta', 'Libre Barcode 128', 'Libre Barcode 39', 'Libre Barcode 39 Extended', 'Libre Barcode 39 Extended Text', 'Libre Barcode 39 Text', 'Libre Barcode EAN13 Text', 'Libre Baskerville', 'Libre Caslon Display', 'Libre Caslon Text', 'Libre Franklin', 'Licorice', 'Life Savers', 'Lilita One', 'Lily Script One', 'Limelight', 'Linden Hill', 'Literata', 'Liu Jian Mao Cao', 'Livvic', 'Lobster', 'Lobster Two', 'Londrina Outline', 'Londrina Shadow', 'Londrina Sketch', 'Londrina Solid', 'Long Cang', 'Lora', 'Love Ya Like A Sister', 'Loved by the King', 'Lovers Quarrel', 'Luckiest Guy', 'Lugrasimo', 'Lumanosimo', 'Lustria', 'Luxurious Roman', 'Luxurious Script', 'M PLUS 1', 'M PLUS 1 Code', 'M PLUS 1p', 'M PLUS 2', 'M PLUS Code Latin', 'M PLUS Rounded 1c', 'Ma Shan Zheng', 'Macondo', 'Macondo Swash Caps', 'Mada', 'Magra', 'Maiden Orange', 'Maitree', 'Major Mono Display', 'Mako', 'Mali', 'Mallanna', 'Mandali', 'Manjari', 'Manrope', 'Mansalva', 'Manuale', 'Marcellus', 'Marcellus SC', 'Marck Script', 'Margarine', 'Marko One', 'Marmelad', 'Martel', 'Martel Sans', 'Marvel', 'Mate', 'Mate SC', 'Maven Pro', 'McLaren', 'Mea Culpa', 'Meddon', 'MedievalSharp', 'Medula One', 'Meera Inimai', 'Megrim', 'Meie Script', 'Meow Script', 'Merienda', 'Merienda One', 'Merriweather', 'Merriweather Sans', 'Metal', 'Metal Mania', 'Metamorphous', 'Metrophobic', 'Michroma', 'Milonga', 'Miltonian', 'Miltonian Tattoo', 'Mina', 'Miniver', 'Miriam Libre', 'Mirza', 'Miss Fajardose', 'Mitr', 'Mochiy Pop One', 'Mochiy Pop P One', 'Modak', 'Modern Antiqua', 'Mogra', 'Mohave', 'Molengo', 'Molle', 'Monda', 'Monofett', 'Monoton', 'Monsieur La Doulaise', 'Montaga', 'Montagu Slab', 'MonteCarlo', 'Montez', 'Montserrat', 'Montserrat Alternates', 'Montserrat Subrayada', 'Moo Lah Lah', 'Moul', 'Moulpali', 'Mountains of Christmas', 'Mouse Memoirs', 'Mr Bedfort', 'Mr Dafoe', 'Mr De Haviland', 'Mrs Saint Delafield', 'Mrs Sheppards', 'Ms Madi', 'Mukta', 'Mukta Mahee', 'Mukta Malar', 'Mukta Vaani', 'Mulish', 'Murecho', 'MuseoModerno', 'My Soul', 'Mystery Quest', 'NTR', 'Nanum Brush Script', 'Nanum Gothic', 'Nanum Gothic Coding', 'Nanum Myeongjo', 'Nanum Pen Script', 'Nasalization', 'Nerko One', 'Neucha', 'Neuton', 'New Rocker', 'New Tegomin', 'News Cycle', 'Newsreader', 'Niconne', 'Niramit', 'Nixie One', 'Nobile', 'Nokora', 'Norican', 'Nosifier', 'Notable', 'Nothing You Could Do', 'Noticia Text', 'Noto Kufi Arabic', 'Noto Music', 'Noto Naskh Arabic', 'Noto Nastaliq Urdu', 'Noto Rashi Hebrew', 'Noto Sans', 'Noto Sans Arabic', 'Noto Sans Armenian', 'Noto Sans Avestan', 'Noto Sans Balinese', 'Noto Sans Bamum', 'Noto Sans Batak', 'Noto Sans Bengali', 'Noto Sans Bhaiksuki', 'Noto Sans Brahmi', 'Noto Sans Buginese', 'Noto Sans Buhid', 'Noto Sans Canadian Aboriginal', 'Noto Sans Carian', 'Noto Sans Caucasian Albanian', 'Noto Sans Chakma', 'Noto Sans Cham', 'Noto Sans Cherokee', 'Noto Sans Coptic', 'Noto Sans Cuneiform', 'Noto Sans Cypriot', 'Noto Sans Deseret', 'Noto Sans Devanagari', 'Noto Sans Display', 'Noto Sans Duployan', 'Noto Sans Egyptian Hieroglyphs', 'Noto Sans Elbasan', 'Noto Sans Elymaic', 'Noto Sans Georgian', 'Noto Sans Glagolitic', 'Noto Sans Gothic', 'Noto Sans Grantha', 'Noto Sans Gujarati', 'Noto Sans Gunjala Gondi', 'Noto Sans Gurmukhi', 'Noto Sans HK', 'Noto Sans Hanifi Rohingya', 'Noto Sans Hanunoo', 'Noto Sans Hatran', 'Noto Sans Hebrew', 'Noto Sans Imperial Aramaic', 'Noto Sans Indic Siyaq Numbers', 'Noto Sans Inscriptional Pahlavi', 'Noto Sans Inscriptional Parthian', 'Noto Sans JP', 'Noto Sans Javanese', 'Noto Sans KR', 'Noto Sans Kaithi', 'Noto Sans Kannada', 'Noto Sans Kayah Li', 'Noto Sans Kharoshthi', 'Noto Sans Khmer', 'Noto Sans Khojki', 'Noto Sans Khudawadi', 'Noto Sans Lao', 'Noto Sans Lepcha', 'Noto Sans Limbu', 'Noto Sans Linear A', 'Noto Sans Linear B', 'Noto Sans Lisu', 'Noto Sans Lycian', 'Noto Sans Lydian', 'Noto Sans Mahajani', 'Noto Sans Malayalam', 'Noto Sans Mandaic', 'Noto Sans Manichaean', 'Noto Sans Marchen', 'Noto Sans Masaram Gondi', 'Noto Sans Math', 'Noto Sans Mayan Numerals', 'Noto Sans Medefaidrin', 'Noto Sans Meetei Mayek', 'Noto Sans Mende Kikakui', 'Noto Sans Meroitic', 'Noto Sans Miao', 'Noto Sans Modi', 'Noto Sans Mongolian', 'Noto Sans Mono', 'Noto Sans Mro', 'Noto Sans Myanmar', 'Noto Sans N Ko', 'Noto Sans Nabataean', 'Noto Sans Newa', 'Noto Sans Nushu', 'Noto Sans Ogham', 'Noto Sans Ol Chiki', 'Noto Sans Old Hungarian', 'Noto Sans Old Italic', 'Noto Sans Old North Arabian', 'Noto Sans Old Permic', 'Noto Sans Old Persian', 'Noto Sans Old Sogdian', 'Noto Sans Old South Arabian', 'Noto Sans Old Turkic', 'Noto Sans Oriya', 'Noto Sans Osage', 'Noto Sans Osmanya', 'Noto Sans Pahawh Hmong', 'Noto Sans Palmyrene', 'Noto Sans Pau Cin Hau', 'Noto Sans Phags Pa', 'Noto Sans Phoenician', 'Noto Sans Psalter Pahlavi', 'Noto Sans Rejang', 'Noto Sans Runic', 'Noto Sans SC', 'Noto Sans Samaritan', 'Noto Sans Saurashtra', 'Noto Sans Sharada', 'Noto Sans Shavian', 'Noto Sans Siddham', 'Noto Sans Sinhala', 'Noto Sans Sogdian', 'Noto Sans Sora Sompeng', 'Noto Sans Soyombo', 'Noto Sans Sundanese', 'Noto Sans Syloti Nagri', 'Noto Sans Symbols', 'Noto Sans Symbols 2', 'Noto Sans Syriac', 'Noto Sans TC', 'Noto Sans Tagalog', 'Noto Sans Tagbanwa', 'Noto Sans Tai Le', 'Noto Sans Tai Tham', 'Noto Sans Tai Viet', 'Noto Sans Tamil', 'Noto Sans Tangsa', 'Noto Sans Telugu', 'Noto Sans Thaana', 'Noto Sans Tibetan', 'Noto Sans Tifinagh', 'Noto Sans Tirhuta', 'Noto Sans Ugaritic', 'Noto Sans Vai', 'Noto Sans Wancho', 'Noto Sans Warang Citi', 'Noto Sans Yi', 'Noto Sans Zanabazar Square', 'Noto Serif', 'Noto Serif Ahom', 'Noto Serif Armenian', 'Noto Serif Balinese', 'Noto Serif Bengali', 'Noto Serif Devanagari', 'Noto Serif Display', 'Noto Serif Dogra', 'Noto Serif Ethiopic', 'Noto Serif Georgian', 'Noto Serif Grantha', 'Noto Serif Gujarati', 'Noto Serif Gurmukhi', 'Noto Serif Hebrew', 'Noto Serif JP', 'Noto Serif KR', 'Noto Serif Kannada', 'Noto Serif Khmer', 'Noto Serif Lao', 'Noto Serif Malayalam', 'Noto Serif Myanmar', 'Noto Serif Nyiakeng Puachue Hmong', 'Noto Serif SC', 'Noto Serif Sinhala', 'Noto Serif TC', 'Noto Serif Tamil', 'Noto Serif Tangut', 'Noto Serif Telugu', 'Noto Serif Thai', 'Noto Serif Tibetan', 'Noto Serif Yezidi', 'Noto Traditional Nushu', 'Nova Cut', 'Nova Flat', 'Nova Mono', 'Nova Oval', 'Nova Round', 'Nova Script', 'Nova Slim', 'Nova Square', 'Numans', 'Nunito', 'Nunito Sans', 'Nuosu SIL', 'Odibee Sans', 'Odor Mean Chey', 'Offside', 'Oi', 'Old Standard TT', 'Oldenburg', 'Ole', 'Oleo Script', 'Oleo Script Swash Caps', 'Oooh Baby', 'Open Sans', 'Oranienbaum', 'Orbitron', 'Oregano', 'Orelega One', 'Orienta', 'Original Surfer', 'Oswald', 'Outfit', 'Over the Rainbow', 'Overlock', 'Overlock SC', 'Overpass', 'Overpass Mono', 'Ovo', 'Oxanium', 'Oxygen', 'Oxygen Mono', 'PT Mono', 'PT Sans', 'PT Sans Caption', 'PT Sans Narrow', 'PT Serif', 'PT Serif Caption', 'Pacifico', 'Padauk', 'Palanquin', 'Palanquin Dark', 'Pangolin', 'Paprika', 'Parisienne', 'Passero One', 'Passion One', 'Passions Conflict', 'Pathway Gothic One', 'Patrick Hand', 'Patrick Hand SC', 'Pattaya', 'Patua One', 'Peralta', 'Permanent Marker', 'Petemoss', 'Petit Formal Script', 'Petrona', 'Philosopher', 'Piazzolla', 'Piedra', 'Pinyon Script', 'Pirata One', 'Plaster', 'Play', 'Playball', 'Playfair Display', 'Playfair Display SC', 'Plus Jakarta Sans', 'Podkova', 'Poiret One', 'Poller One', 'Poly', 'Pompiere', 'Pontano Sans', 'Poor Story', 'Poppins', 'Port Lligat Sans', 'Port Lligat Slab', 'Potta One', 'Pragati Narrow', 'Praise', 'Prata', 'Preahvihear', 'Press Start 2P', 'Pridi', 'Princess Sofia', 'Prociono', 'Prompt', 'Prosto One', 'Proza Libre', 'Public Sans', 'Puppies Play', 'Puritan', 'Purple Purse', 'Qahiri', 'Quando', 'Quantico', 'Quattrocento', 'Quattrocento Sans', 'Questrial', 'Quicksand', 'Quintessential', 'Qwigley', 'Qwitcher Grypen', 'Racing Sans One', 'Radio Canada', 'Radley', 'Rajdhani', 'Rakkas', 'Raleway', 'Raleway Dots', 'Ramabhadra', 'Ramaraja', 'Rambla', 'Rammetto One', 'Ranchers', 'Rancho', 'Ranga', 'Rasa', 'Rationale', 'Ravi Prakash', 'Readex Pro', 'Recursive', 'Red Hat Display', 'Red Hat Mono', 'Red Hat Text', 'Red Rose', 'Redacted', 'Redacted Script', 'Redressed', 'Reem Kufi', 'Reem Kufi Fun', 'Reem Kufi Ink', 'Reenie Beanie', 'Reggae One', 'Revalia', 'Rhodium Libre', 'Ribeye', 'Ribeye Marrow', 'Righteous', 'Risque', 'Road Rage', 'Roboto', 'Roboto Condensed', 'Roboto Flex', 'Roboto Mono', 'Roboto Serif', 'Roboto Slab', 'Rochester', 'Rock Salt', 'RocknRoll One', 'Rokkitt', 'Romanesco', 'Ropa Sans', 'Rosario', 'Rosarivo', 'Rouge Script', 'Rowdies', 'Rozha One', 'Rubik', 'Rubik 80s Fade', 'Rubik Beastly', 'Rubik Bubbles', 'Rubik Burned', 'Rubik Dirt', 'Rubik Distressed', 'Rubik Gemstones', 'Rubik Glitch', 'Rubik Iso', 'Rubik Marker Hatch', 'Rubik Maze', 'Rubik Microbe', 'Rubik Mono One', 'Rubik Moonrocks', 'Rubik Pixels', 'Rubik Puddles', 'Rubik Wet Paint', 'Ruda', 'Rufina', 'Ruge Boogie', 'Ruluko', 'Rum Raisin', 'Ruslan Display', 'Russo One', 'Ruthie', 'Rye', 'STIX Two Text', 'Sacramento', 'Sahitya', 'Sail', 'Saira', 'Saira Condensed', 'Saira Extra Condensed', 'Saira Semi Condensed', 'Saira Stencil One', 'Salsa', 'Sanchez', 'Sancreek', 'Sansita', 'Sansita Swashed', 'Sarabun', 'Sarala', 'Sarina', 'Sarpanch', 'Sassy Frass', 'Satisfy', 'Sawarabi Gothic', 'Sawarabi Mincho', 'Scada', 'Scheherazade New', 'Schoolbell', 'Scope One', 'Seaweed Script', 'Secular One', 'Sedgwick Ave', 'Sedgwick Ave Display', 'Send Flowers', 'Sevillana', 'Seymour One', 'Shadows Into Light', 'Shadows Into Light Two', 'Shalimar', 'Shanti', 'Share', 'Share Tech', 'Share Tech Mono', 'Shippori Antique', 'Shippori Antique B1', 'Shippori Mincho', 'Shippori Mincho B1', 'Shojumaru', 'Short Stack', 'Shrikhand', 'Siemreap', 'Sigmar One', 'Signika', 'Signika Negative', 'Silkscreen', 'Simonetta', 'Single Day', 'Sintony', 'Sirin Stencil', 'Six Caps', 'Skranji', 'Slabo 13px', 'Slabo 27px', 'Slackey', 'Smokum', 'Smooch', 'Smooch Sans', 'Smythe', 'Sniglet', 'Snippet', 'Snowburst One', 'Sofadi One', 'Sofia', 'Solway', 'Song Myung', 'Sonsie One', 'Sora', 'Sorts Mill Goudy', 'Source Code Pro', 'Source Sans 3', 'Source Serif 4', 'Space Grotesk', 'Space Mono', 'Special Elite', 'Spectral', 'Spectral SC', 'Spicy Rice', 'Spinnaker', 'Spirax', 'Splash', 'Squada One', 'Sree Krushnadevaraya', 'Sriracha', 'Srisakdi', 'Staatliches', 'Stalemate', 'Stalinist One', 'Stardos Stencil', 'Stick', 'Stick No Bills', 'Stint Ultra Condensed', 'Stint Ultra Expanded', 'Stoke', 'Strait', 'Style Script', 'Stylish', 'Sue Ellen Francisco', 'Suez One', 'Sulphur Point', 'Sumana', 'Sunflower', 'Sunshiney', 'Supermercado One', 'Sura', 'Suranna', 'Suravaram', 'Suwannaphum', 'Swanky and Moo Moo', 'Syncopate', 'Syne', 'Syne Mono', 'Syne Tactile', 'Tajawal', 'Tangerine', 'Tapestry', 'Taprom', 'Tauri', 'Taviraj', 'Teko', 'Telex', 'Tenali Ramakrishna', 'Tenor Sans', 'Text Me One', 'Texturina', 'Thasadith', 'The Nautigal', 'The Girl Next Door', 'Tillana', 'Timmana', 'Tinos', 'Tiro Bangla', 'Tiro Devanagari Hindi', 'Tiro Devanagari Marathi', 'Tiro Devanagari Sanskrit', 'Tiro Gurmukhi', 'Tiro Kannada', 'Tiro Tamil', 'Tiro Telugu', 'Titan One', 'Titillium Web', 'Tomorrow', 'Tourney', 'Trade Winds', 'Train One', 'Trirong', 'Trispace', 'Trocchi', 'Trochut', 'Truculenta', 'Trykker', 'Tsukimi Rounded', 'Tulpen One', 'Turret Road', 'Twinkle Star', 'Uchen', 'Ultra', 'Uncial Antiqua', 'Underdog', 'Unica One', 'UnifrakturCook', 'UnifrakturMaguntia', 'Unkempt', 'Unlock', 'Unna', 'Updock', 'Urbanist', 'VT323', 'Vampiro One', 'Varela', 'Varela Round', 'Varta', 'Vast Shadow', 'Vazirmatn', 'Vesper Libre', 'Viaoda Libre', 'Vibes', 'Vibur', 'Vidaloka', 'Viga', 'Vina Sans', 'Voces', 'Volkhov', 'Vollkorn', 'Vollkorn SC', 'Voltaire', 'Vujahday Script', 'Waiting for the Sunrise', 'Wallpoet', 'Walter Turncoat', 'Warnes', 'Water Brush', 'Waterfall', 'Wellfleet', 'Wendy One', 'WindSong', 'Wire One', 'Wix Madefor Display', 'Wix Madefor Text', 'Work Sans', 'Xanh Mono', 'Yaldevi', 'Yanone Kaffeesatz', 'Yantramanav', 'Yatra One', 'Yellowtail', 'Yeon Sung', 'Yeseva One', 'Yesteryear', 'Yomogi', 'Yrsa', 'Yuji Boku', 'Yuji Hentaigana Akari', 'Yuji Hentaigana Akebono', 'Yuji Mai', 'Yuji Syuku', 'Yusei Magic', 'ZCOOL KuaiLe', 'ZCOOL QingKe HuangYou', 'ZCOOL XiaoWei', 'Zen Antique', 'Zen Antique Soft', 'Zen Dots', 'Zen Kaku Gothic Antique', 'Zen Kaku Gothic New', 'Zen Kurenaido', 'Zen Maru Gothic', 'Zen Old Mincho', 'Zeyada', 'Zhi Mang Xing', 'Zilla Slab', 'Zilla Slab Highlight'
].sort();

type EditingPanelProps = {
  // State
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  textShadow: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  textRotation: number;
  opacity: number;
  imageSrc: string;
  imageRotation: number;
  brightness: number;
  contrast: number;
  aspectRatio: string;
  aiCategory: string;
  
  // Setters
  setText: (text: string) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (font: string) => void;
  setColor: (color: string) => void;
  setTextShadow: (shadow: string) => void;
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleUnderline: () => void;
  setTextRotation: (rotation: number) => void;
  setOpacity: (opacity: number) => void;
  setImageRotation: (rotation: number) => void;
  setBrightness: (brightness: number) => void;
  setContrast: (contrast: number) => void;
  setAspectRatio: (ratio: string) => void;
  setAiCategory: (category: string) => void;

  // Actions
  handleEnhanceImage: () => void;
  handleAiSuggest: () => void;
  undo: () => void;
  redo: () => void;
  
  // Action states
  isEnhancing: boolean;
  isLoadingAi: boolean;
  aiSuggestions: SuggestStyleOutput | null;
  imageInputRef: React.RefObject<HTMLInputElement>;
  canUndo: boolean;
  canRedo: boolean;
};

export default function EditingPanel({
  text, setText, fontSize, setFontSize, fontFamily, setFontFamily, color, setColor, textShadow, setTextShadow,
  fontWeight, toggleBold, fontStyle, toggleItalic, textDecoration, toggleUnderline, textRotation, setTextRotation,
  opacity, setOpacity, imageSrc, imageRotation, setImageRotation, brightness, setBrightness, contrast, setContrast,
  handleEnhanceImage, isEnhancing, imageInputRef, aspectRatio, setAspectRatio,
  aiCategory, setAiCategory, handleAiSuggest, isLoadingAi, aiSuggestions,
  undo, redo, canUndo, canRedo
}: EditingPanelProps) {
  const [fontSearch, setFontSearch] = useState("");
  const [isFontPopoverOpen, setIsFontPopoverOpen] = useState(false);
  const [visibleFontCount, setVisibleFontCount] = useState(50);

  const filteredFonts = popularFonts.filter(font => 
    font.toLowerCase().includes(fontSearch.toLowerCase())
  );

  const displayedFonts = filteredFonts.slice(0, visibleFontCount);

  useEffect(() => {
    setVisibleFontCount(50);
  }, [fontSearch]);

  const handleFontScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop < clientHeight * 1.5) {
      if (visibleFontCount < filteredFonts.length) {
        setVisibleFontCount(prev => prev + 50);
      }
    }
  };

  return (
    <Card className="w-full md:w-96 border-0 md:border-r rounded-none flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-2xl sm:text-3xl">Text Weaver</CardTitle>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo}>
                  <Undo className="h-4 w-4" />
                  <span className="sr-only">Undo</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo}>
                  <Redo className="h-4 w-4" />
                  <span className="sr-only">Redo</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="text" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-6">
          <TabsTrigger value="text" className="w-full"><Type className="mr-2" /> Text</TabsTrigger>
          <TabsTrigger value="image" className="w-full" disabled={!imageSrc}><Paintbrush className="mr-2" /> Image</TabsTrigger>
          <TabsTrigger value="settings" className="w-full"><Settings className="mr-2" /> Settings</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="text">
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="text-content">Text Content</Label>
                <Textarea id="text-content" value={text} onChange={(e) => setText(e.target.value)} placeholder="Your text here" rows={3}/>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>AI Style Helper</Label>
                  <div className="flex space-x-2">
                    <Input value={aiCategory} onChange={(e) => setAiCategory(e.target.value)} placeholder="e.g., 'Nature', 'Tech'"/>
                    <Button onClick={handleAiSuggest} disabled={isLoadingAi}>
                        <Wand2 className="mr-2 h-4 w-4" />
                        {isLoadingAi ? 'Thinking...' : 'Suggest'}
                    </Button>
                  </div>
                  {aiSuggestions && (
                  <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">Suggestion: <span className="font-bold">{aiSuggestions.fontFamily}</span></p>
                      <div className="flex gap-2">
                      {aiSuggestions.colorPalette.map((c) => (
                          <button
                          key={c}
                          className="h-8 w-8 rounded-full border-2"
                          style={{ backgroundColor: c }}
                          onClick={() => setColor(c)}
                          aria-label={`Set color to ${c}`}
                          />
                      ))}
                      </div>
                  </div>
                  )}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="font-family">Font Family</Label>
                    <Popover open={isFontPopoverOpen} onOpenChange={setIsFontPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={isFontPopoverOpen}
                          className="w-full justify-between font-normal"
                          style={{ fontFamily: fontFamily }}
                        >
                          <span className="truncate">{fontFamily}</span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Input
                          placeholder="Search font..."
                          className="h-9 rounded-b-none border-x-0 border-t-0"
                          value={fontSearch}
                          onChange={(e) => setFontSearch(e.target.value)}
                          aria-label="Search for a font"
                        />
                        <ScrollArea className="h-72" onScroll={handleFontScroll}>
                          {displayedFonts.length > 0 ? (
                            displayedFonts.map((font) => (
                              <Button
                                key={font}
                                variant="ghost"
                                className="w-full justify-start font-normal h-auto py-2"
                                style={{ fontFamily: font }}
                                onClick={() => {
                                  setFontFamily(font);
                                  setIsFontPopoverOpen(false);
                                  setFontSearch('');
                                }}
                              >
                                {font}
                              </Button>
                            ))
                          ) : (
                            <p className="p-4 text-center text-sm text-muted-foreground">
                              No font found.
                            </p>
                          )}
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
                    <Slider id="font-size" min={12} max={256} step={1} value={[fontSize]} onValueChange={(v) => setFontSize(v[0])}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="p-1 h-10"/>
                  </div>
                  <div className="space-y-2">
                    <Label>Style</Label>
                    <div className="flex space-x-2">
                      <Button variant={fontWeight === 'bold' ? 'secondary' : 'outline'} size="icon" onClick={toggleBold}><Bold /></Button>
                      <Button variant={fontStyle === 'italic' ? 'secondary' : 'outline'} size="icon" onClick={toggleItalic}><Italic /></Button>
                      <Button variant={textDecoration === 'underline' ? 'secondary' : 'outline'} size="icon" onClick={toggleUnderline}><Underline /></Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text-shadow">Text Shadow</Label>
                  <Select value={textShadow} onValueChange={setTextShadow}>
                      <SelectTrigger id="text-shadow"><SelectValue placeholder="Select shadow" /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="1px 1px 2px rgba(0,0,0,0.4)">Subtle</SelectItem>
                          <SelectItem value="2px 2px 4px rgba(0,0,0,0.5)">Standard</SelectItem>
                          <SelectItem value="3px 3px 6px rgba(0,0,0,0.6)">Strong</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="text-rotation">Rotation: {textRotation}°</Label>
                    <Slider id="text-rotation" min={0} max={360} step={1} value={[textRotation]} onValueChange={(v) => setTextRotation(v[0])}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="opacity">Opacity: {Math.round(opacity * 100)}%</Label>
                    <Slider id="opacity" min={0} max={1} step={0.01} value={[opacity]} onValueChange={(v) => setOpacity(v[0])}/>
                </div>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="image">
            <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="flex items-center"><RotateCw className="mr-2 h-4 w-4" />Rotation</Label>
                        <div className="flex justify-between gap-2">
                            {[0, 90, 180, 270].map(deg => (
                                <Button key={deg} variant={imageRotation === deg ? 'secondary' : 'outline'} onClick={() => setImageRotation(deg)} className="flex-1">{deg}°</Button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="brightness">Brightness: {brightness}%</Label>
                        <Slider id="brightness" min={0} max={200} step={1} value={[brightness]} onValueChange={(v) => setBrightness(v[0])}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contrast">Contrast: {contrast}%</Label>
                        <Slider id="contrast" min={0} max={200} step={1} value={[contrast]} onValueChange={(v) => setContrast(v[0])}/>
                    </div>
                </div>
                <Separator />
                <div className="space-y-2">
                    <Button onClick={handleEnhanceImage} disabled={isEnhancing} className="w-full">
                        <Wand2 className="mr-2 h-4 w-4" />
                        {isEnhancing ? 'Enhancing...' : 'Enhance Image'}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => imageInputRef.current?.click()}>
                        <ImageIcon className="mr-2 h-4 w-4" /> Change Image
                    </Button>
                </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="settings">
            <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Canvas Settings</h3>
                    <div className="space-y-2">
                        <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                        <Select value={aspectRatio} onValueChange={setAspectRatio}>
                            <SelectTrigger id="aspect-ratio"><SelectValue placeholder="Select ratio" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="original">Original</SelectItem>
                                <SelectItem value="1:1">1:1 (Square)</SelectItem>
                                <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                                <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Card>
  );
}
